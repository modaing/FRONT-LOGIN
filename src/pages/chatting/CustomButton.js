import '../../css/chatting/customButton.css'
import confetti from "https://esm.run/canvas-confetti@1";

function CustomButton() {
    function onClick() {
      confetti({
        particleCount: 150,
        spread: 60
      });
    }
  
    return (
      <button className="button" onClick={onClick}>
        <span>🎉</span>
        <span>Join</span>
      </button>
    );
  }

  export default CustomButton;