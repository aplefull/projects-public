import React, { Fragment } from 'react';
import './App.scss';
import birdsData from './data.js';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const _ = require('lodash');

class App extends React.Component {

  constructor(props) {
    super(props);
    let tempPath = { species: Math.floor(Math.random() * 6), bird: Math.floor(Math.random() * 6) };
    let tempGuess = birdsData[tempPath.species][tempPath.bird];
    this.state = { correctGuessPath: tempPath, correctGuess: tempGuess, score: 0, level: 1, voice: '' };
    this.nextLevel = this.nextLevel.bind(this);
    this.scoreUpdate = this.scoreUpdate.bind(this);
    this.finishGame = this.finishGame.bind(this);
    this.retry = this.retry.bind(this);
    this.updPlayer = this.updPlayer.bind(this);

    console.log('%c Use data from console only for testing purposes, otherwise it\'s called...', 'font-weight: bold;');
    console.log('%c Cheating', 'font-weight: bold; font-size: 50px; color: red; text-shadow: 1px 1px 0 black;');
    console.log('Correct bird: ', this.state.correctGuess.name);
  }

  nextLevel() {
    let prevBirdPath = this.state.correctGuessPath;
    let tempPath = { species: Math.floor(Math.random() * 6), bird: Math.floor(Math.random() * 6) };
    while (_.isEqual(prevBirdPath, tempPath)) tempPath = { species: Math.floor(Math.random() * 6), bird: Math.floor(Math.random() * 6) };
    let tempGuess = birdsData[tempPath.species][tempPath.bird];
    document.querySelector('.level').innerHTML = `Level: ${this.state.level + 1}`;
    this.setState({ correctGuessPath: tempPath, correctGuess: tempGuess, level: this.state.level + 1 });
  }

  scoreUpdate(scr) {
    document.querySelector('.score').innerHTML = `Score: ${this.state.score + scr}`;
    this.setState({ score: this.state.score + scr });
  }

  finishGame() {
    let str;

    document.querySelector('.level').innerHTML = 'Игра окончена.';
    document.querySelector('.main-player-field').style.display = 'none';
    document.querySelector('.playfield').style.display = 'none';
    document.querySelector('.next-level').style.display = 'none';
    document.querySelector('.end-screen-wrapper').style.display = 'flex';

    if (this.state.score === 30) {
      str = `Вы набрали ${this.state.score} из 30 возможных баллов. Потрясающе :o`;
      document.querySelector('.pika').style.display = 'block';
    }

    else if (this.state.score === 29) {
      str = `Вы набрали ${this.state.score} из 30 возможных баллов. Всего 1 балл! Может, ещё раз? 😏`;
    }

    else if (this.state.score > 25) {
      str = `Вы набрали ${this.state.score} из 30 возможных баллов. So close!`;
    }

    else if (this.state.score > 20) {
      str = `Вы набрали ${this.state.score} из 30 возможных баллов. Очень круто!`;
    }

    else if (this.state.score > 15) {
      str = `Вы набрали ${this.state.score} из 30 возможных баллов. Неплохо.`;
    }

    else if (this.state.score > 10) {
      str = `Вы набрали ${this.state.score} из 30 возможных баллов. Неплохо, но вы можете лучше :^)`;
    }

    else if (this.state.score > 5) {
      str = `Вы набрали ${this.state.score} из 30 возможных баллов. Что-то не очень получилось, да?`;
    }

    else if (this.state.score === 0) {
      str = `Вы набрали ${this.state.score} из 30 возможных баллов. Нуу, в каком-то смысле вы заняли первое место 🤔`;
    }

    else {
      str = `Вы набрали ${this.state.score} из 30 возможных баллов. Может, в следующий раз повезёт?`;
    }

    document.querySelector('.score-count').innerHTML = str;
  }

  retry() {
    let tempPath = { species: Math.floor(Math.random() * 6), bird: Math.floor(Math.random() * 6) };
    let tempGuess = birdsData[tempPath.species][tempPath.bird];
    this.setState({ correctGuessPath: tempPath, correctGuess: tempGuess, score: 0, level: 1 });

    document.querySelector('.level').innerHTML = 'Level: 1';
    document.querySelector('.score').innerHTML = 'Score: 0';

    document.querySelector('.game-begin').style.display = 'block';
    document.querySelector('.content-wrapper').style.display = 'none';
    document.querySelector('.desc').style.display = 'none';
    document.querySelector('.bird-name-wrapper').children[0].innerHTML = '******';
    document.querySelector('.main-img').src = 'assets/question-mark.png';
    document.querySelector('.next-level').style.backgroundColor = '#303030';
    document.querySelector('.pika').style.display = 'none';

    document.querySelectorAll('.guess').forEach((element) => {
      element.style.backgroundColor = '#444444';
    });
    document.querySelector('.next-level').setAttribute('active', 'false');

    document.querySelector('.main-player-field').style.display = 'flex';
    document.querySelector('.playfield').style.display = 'flex';
    document.querySelector('.next-level').style.display = 'inline-block';
    document.querySelector('.end-screen-wrapper').style.display = 'none ';

    document.querySelectorAll('.rhap_container')[0].querySelector('audio').pause();
    document.querySelectorAll('.rhap_container')[1].querySelector('audio').pause();
  }

  updPlayer(data) {
    this.setState({ birdVoice: data.audio });
  }

  render() {
    return (
      <Fragment>
        <Header />
        <Menu />
        <MainPlayerField data={birdsData} guessPath={this.state.correctGuessPath} />
        <div className='playfield'>
          <LeftPlayField data={birdsData} guess={this.state.correctGuess} guessPath={this.state.correctGuessPath} onScoreUpdate={this.scoreUpdate} callPlayer={this.updPlayer} />
          <RightPlayField data={birdsData} guessPath={this.state.correctGuessPath} voice={this.state.birdVoice} />
        </div>
        <Button onNextLevelClick={this.nextLevel} onFinishGameClick={this.finishGame} currentLevel={this.state.level} />
        <EndGame onRetryClick={this.retry} />
      </Fragment>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <div className='logo'>
        <img src='assets/logo.png' className='logo' alt='logo'></img>
        <div>
          <p className='level'>Level: 1</p>
          <p className='score'>Score: 0</p>
        </div>
      </div>
    );
  }
}

class Menu extends React.Component {
  render() {
    return (
      <div className='menu'>
        <ul>
          <li><p>Разминка</p></li>
          <li><p>Воробьиные</p></li>
          <li><p>Лесные птицы</p></li>
          <li><p>Певчие птицы</p></li>
          <li><p>Хищные птицы</p></li>
          <li><p>Морские птицы</p></li>
        </ul>
      </div>
    );
  }
}

class MainPlayerField extends React.Component {
  render() {
    return (
      <div className='main-player-field'>
        <img src='assets/question-mark.png' alt='birdie' className='main-img'></img>
        <div className='player-holder'>
          <div className='bird-name-wrapper'>
            <p>******</p>
          </div>
          <AudioPlayer
            src={this.props.data[this.props.guessPath.species][this.props.guessPath.bird].audio}
            data={this.props.data}
            path={this.props.guessPath}
            autoPlay={false}
          />
        </div>
      </div>
    );
  }
}

class LeftPlayField extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hasGuessed: false, currentScore: 5, names: [], pathes: [] };
    this.choseBird = this.choseBird.bind(this);
    this.getRandomNames = this.getRandomNames.bind(this);
  }

  componentDidMount() {
    this.getRandomNames();
    this.forceUpdate();
  }

  componentDidUpdate(prev) {
    if (!_.isEqual(prev, this.props)) {
      this.setState({ hasGuessed: false, currentScore: 5, names: [], pathes: [] }, () => {
        this.getRandomNames();
      });

      console.log('Correct bird: ', this.props.guess.name);
    }
  }

  choseBird(e) {
    let index;
    let data;
    let target;

    if (e.target.nodeName === 'LI') target = e.target;
    else target = e.target.parentElement;

    index = this.state.names.indexOf(target.querySelector('p').innerHTML);
    data = this.props.data[this.state.pathes[index].species][this.state.pathes[index].bird];

    if (document.querySelector('.game-begin').style.display !== 'none') {
      document.querySelector('.game-begin').style.display = 'none';
      document.querySelector('.content-wrapper').style.display = 'flex';
      document.querySelector('.desc').style.display = 'block';
    }

    if (target.querySelector('p').innerHTML === this.props.guess.name && this.state.hasGuessed === false) {
      target.querySelector('div').style.backgroundColor = '#00bc8c';
      document.querySelector('.bird-name-wrapper').children[0].innerHTML = data.name;
      document.querySelector('.main-img').src = data.image;
      document.querySelector('.next-level').style.backgroundColor = '#00bc8c';
      document.querySelector('.next-level').setAttribute('active', 'true');

      document.querySelectorAll('.rhap_container ')[0].querySelector('audio').pause();

      let audio = new Audio('/assets/correct.mp3');
      audio.play();

      this.setState({ hasGuessed: true });
      this.props.onScoreUpdate(this.state.currentScore);
    }

    if (this.state.hasGuessed === false && target.querySelector('div').style.backgroundColor !== 'rgb(214, 44, 26)' && target.querySelector('div').style.backgroundColor !== 'rgb(0, 188, 140)') {
      let audio = new Audio('/assets/incorrect.mp3');
      audio.play();
      target.querySelector('div').style.backgroundColor = '#d62c1a';
    }

    if (this.state.currentScore > 0) {
      this.setState({ currentScore: this.state.currentScore - 1 });
    }

    document.querySelector('.content-wrapper').querySelector('img').src = data.image;
    document.querySelector('.bird-names-wrapper').children[0].innerHTML = data.name;
    document.querySelector('.p-wrapper').children[0].innerHTML = data.species;
    document.querySelector('.desc').innerHTML = data.description;

    this.props.callPlayer(data);
  }

  getRandomNames() {
    let bird;
    let species;
    let index;
    let newState = this.state.names;
    let newPath = this.state.pathes;
    let birdsArr = [0, 1, 2, 3, 4, 5];
    let speciesArr = [0, 1, 2, 3, 4, 5];
    let replaceBird = true;

    for (let i = 0; i < 6; i++) {
      bird = Math.floor(Math.random() * birdsArr.length);
      species = Math.floor(Math.random() * speciesArr.length);
      this.state.names.push(this.props.data[birdsArr[species]][birdsArr[bird]].name);
      this.state.pathes.push({ species: birdsArr[species], bird: birdsArr[bird] });
      birdsArr.splice(bird, 1);
      speciesArr.splice(species, 1);
    }

    for (let i = 0; i < 6; i++) {
      if (this.state.names[i] === this.props.guess.name) {
        replaceBird = false;
      }
    }

    if (replaceBird) {
      index = Math.floor(Math.random() * 6);
      newState[index] = this.props.guess.name;
      newPath[index] = { species: this.props.guessPath.species, bird: this.props.guessPath.bird };
    }

    this.setState({ names: newState });
    this.setState({ pathes: newPath });
  }

  render() {
    return (
      <div className='left-playfield'>
        <ul>
          <li onClick={this.choseBird}><div className='guess'></div><p>{this.state.names[0]}</p></li>
          <li onClick={this.choseBird}><div className='guess'></div><p>{this.state.names[1]}</p></li>
          <li onClick={this.choseBird}><div className='guess'></div><p>{this.state.names[2]}</p></li>
          <li onClick={this.choseBird}><div className='guess'></div><p>{this.state.names[3]}</p></li>
          <li onClick={this.choseBird}><div className='guess'></div><p>{this.state.names[4]}</p></li>
          <li onClick={this.choseBird}><div className='guess'></div><p>{this.state.names[5]}</p></li>
        </ul>
      </div>
    );
  }
}

class RightPlayField extends React.Component {
  render() {
    setTimeout(() => {
      let playPromise = document.querySelectorAll('.rhap_container')[1].querySelector('audio').play();

      if (playPromise !== undefined) {
        playPromise.then(_ => {
          document.querySelectorAll('.rhap_container ')[1].querySelector('audio').pause();
        })
          .catch(error => {
            console.log('');
          });
      }
    }, 0);

    return (
      <div className='right-playfield'>
        <p className='game-begin'>Послушайте плеер. <br></br> Выберите птицу из списка</p>
        <div className='content-wrapper'>
          <img src='' alt='small birdie'></img>
          <div className='bird-names-wrapper'>
            <p></p>
            <div className='p-wrapper'><p></p></div>
            <AudioPlayer
              src={this.props.voice}
              data={this.props.data}
              path={this.props.guessPath}
              autoPlay={false}
            />
          </div>
        </div>
        <p className='desc'></p>
      </div>
    );
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.changeLevel = this.changeLevel.bind(this);
  }

  changeLevel() {
    if (document.querySelector('.next-level').getAttribute('active') === 'true') {
      document.querySelector('.game-begin').style.display = 'block';
      document.querySelector('.content-wrapper').style.display = 'none';
      document.querySelector('.desc').style.display = 'none';
      document.querySelector('.bird-name-wrapper').children[0].innerHTML = '******';
      document.querySelector('.main-img').src = 'assets/question-mark.png';
      document.querySelector('.next-level').style.backgroundColor = '#303030';

      document.querySelectorAll('.guess').forEach((element) => {
        element.style.backgroundColor = '#444444';
      });
      document.querySelector('.next-level').setAttribute('active', 'false');

      if (this.props.currentLevel < 6) this.props.onNextLevelClick();
      else this.props.onFinishGameClick();
    }

  }

  render() {
    return (
      <button onClick={this.changeLevel} className='next-level' active='false'>Next Level</button>
    );
  }
}

class EndGame extends React.Component {
  constructor(props) {
    super(props);
    this.requestRetry = this.requestRetry.bind(this);
  }

  requestRetry() {
    this.props.onRetryClick();
  }

  render() {
    return (
      <div className='end-screen-wrapper'>
        <p className='congrats'>Поздравляю!</p>
        <p className='score-count'></p>
        <img className='pika' src='/assets/pika.jpg' alt='surprised pikachu' />
        <button onClick={this.requestRetry} className='retry-button'>Сыграть ещё раз</button>
      </div>
    );
  }
}

export default App;
