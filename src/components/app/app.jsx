import React from 'react';
import PomodoroTimer from '../PomodoroTimer';
import Hero from '../hero';
import Backtest from '../backtest';
import './app.css';

function App() {	
	return (
		<>
			<div className="container">
				<section className="section section_hero">
					<Hero />
				</section>
				{/* <section className="section section_about">
					<h3 className="section__title">
						<span className="primary-color">01. </span>About me
					</h3>
				</section> */}
				<section className="section section_projects">
					<h3 className="section__title">
						<span className="section__title_accent">01. </span>Projects
					</h3>
					<div className="projects">
						<div className="projects__item">
							<h4 className="projects__item-title">Pomodoro Timer</h4>
							<PomodoroTimer />
						</div>
						<div className="projects__item">
							<h4 className="projects__item-title">Squeeze Backtest Service</h4>
							<Backtest />
						</div>
					</div>
				</section>
			</div>
		</>
	);
}

export default App;
