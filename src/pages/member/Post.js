import { useEffect, useRef } from 'react';
import DaumPostcode from 'react-daum-postcode';
import '../../css/member/Post.css';

const Post = (props) => {
  const { visible, onClose } = props;
  const modalRef = useRef();

  const handlePostCode = (data, event) => {
    let fullAddress = data.address;
    let extraAddress = ''; 
    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }
    props.onAddData(data);
    onClose();
  }

  const handleClose = () => {
    onClose();
  };

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (visible) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [visible, onClose]);

  return (
    <div className={`modalStyle123 ${visible ? 'visible' : 'hidden'}`} ref={modalRef}>
      <div className="modalContent" style={{height: "500px", width: "1000px", padding: "0 30px 0 0"}}>
        <DaumPostcode style={{ width: "100%", height: "100%"}} onComplete={(data, event) => handlePostCode(data,event)} /> 
        <div className="exitButton" onClick={handleClose} style={{ position: "absolute", top: "10px", right: "10px" }}>×</div>
      </div>
    </div>
  );
};

export default Post;
