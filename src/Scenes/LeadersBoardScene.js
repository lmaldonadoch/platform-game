/* eslint-disable import/no-unresolved */
import Phaser from 'phaser';
import Button from '../Objects/Button';
import { getScoreBoard } from '../api';


export default class LeadersBoardScene extends Phaser.Scene {
  constructor() {
    super('LeadersBoard');
  }

  create() {
    this.getScores = getScoreBoard();
    this.topScorers = this.add.text(
      280, 50, 'Top 10 Scores',
      {
        fontSize: '32px',
        fill: '#eee',
        fontStyle: 'bold',
      },
    );

    this.optionsMenu = new Button(
      this, 400, 550,
      'blueButton1',
      'blueButton2',
      'Menu',
      'Title',
    );
    this.leadersData = [];

    let table;

    this.getItems = (score) => {
      const data = [];
      let i = 0;
      while (score[i] !== undefined) {
        if (score[i]) {
          data.push(score[i][0]);
          data.push(score[i][1]);
        }
        i += 1;
      }
      return data;
    };

    this.getScores.then((scores) => {
      this.leadersData.push(this.getItems(scores));

      let i = 1;
      let container;
      const newCellObject = (scene, cell) => {
        const background = scene.add.graphics()
          .fillStyle(0x003366)
          .fillRect(2, 2, 200 - 2, 40 - 2);

        const txt = scene.add.text(
          10, 20, cell.index + 1,
          {
            fontSize: '16px',
            fill: '#eee',
            fontStyle: 'bold',
          },
        );

        if (this.leadersData[0][i - 1] !== undefined) {
          const txt1 = scene.add.text(
            150, 20,
            this.leadersData[0][i - 1],
            {
              fontSize: '16px',
              fill: '#ffcc00',
              fontStyle: 'bold',
            },
          );

          const txt2 = scene.add.text(
            30, 20,
            this.leadersData[0][i].substring(0, 10),
            {
              fontSize: '16px',
              fill: '#ffcc00',
              fontStyle: 'bold',
            },
          );
          container = scene.add.container(
            0, 0,
            [background, txt, txt1, txt2],
          );
        } else {
          container = scene.add.container(
            0, 0,
            [background, txt],
          );
        }
        i += 2;
        return container;
      };

      const onCellVisible = (cell) => {
        cell.setContainer(newCellObject(this, cell));
      };

      table = this.add.rexGridTable(
        425, 300, 250, 405, {
          cellWidth: 200,
          cellHeight: 40,
          cellsCount: 10,
          columns: 1,
          cellVisibleCallback: onCellVisible.bind(this),
          clamplTableOXY: false,
        },
      );

      this.table = table;
    });
  }

  ready() {
    this.load.on('complete', () => {
      this.table.destroy();
      this.leadersData.destroy();
      this.optionsMenu.destroy();
      this.getScores.destroy();
      this.topScorers.destroy();
      this.ready();
    });
  }
}