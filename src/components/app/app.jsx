import './app.css';
import PdClock from '../pdClock';
import Hero from '../hero';

function App() {
	return (
		<>
			<div className="container">
				<div className="section hero-section">
					<Hero />
				</div>
				<div className="section about-section">
					<h3 className="section-title">
						<span className="primary-color">01. </span>About Me
					</h3>
				</div>
				<div className="section pet-section">
					<h3 className="section-title">
						<span className="primary-color">02. </span>Pet Projects
					</h3>
					<PdClock />
				</div>
			</div>
		</>
	);
}

export default App;
