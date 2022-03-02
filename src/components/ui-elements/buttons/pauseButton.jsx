import './styles.css';

function PauseButton(props) {
	return (
		<button {...props} className={'icon-btn'}>
            <div className='svg-icon clock-control-icon pause'></div>
		</button>
	);
}

export default PauseButton;
