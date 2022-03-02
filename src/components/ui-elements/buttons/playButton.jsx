import './styles.css';

function PlayButton(props) {
	return (
		<button {...props} className={'icon-btn'}>
            <div className='svg-icon clock-control-icon play'></div>
		</button>
	);
}

export default PlayButton;
