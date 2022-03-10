import './styles.css';

function PauseButton(props) {
	return (
		<button className={'icon-btn'} {...props}>
            <div className='svg-icon clock-control-icon pause'></div>
		</button>
	);
}

export default PauseButton;
