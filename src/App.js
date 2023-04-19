import { useRef, useState } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

import "./App.css";

let fixedCharges = 0;
let custCharges = 0;
let elecDuties = 0;
let EDINT = 0;
let addlCharges = 0;
let surCharges = 0;
let INT = 0;
let lossGain = 0;
let netAmount = 0;

const App = () => {
  const webcamRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");
  const [units, setUnits] = useState("");
  const [progress, setProgress] = useState(0);
  const [billAmount, setBillAmount] = useState(0);

  const capture = () => {
    const image = webcamRef.current.getScreenshot();
    setImage(image);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    Tesseract.recognize(image, "eng", {
      logger: (m) => {
        console.log(m);
        if (m.status === "recognizing text") {
          setProgress(parseInt(m.progress * 100));
        }
      },
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        console.log(result.data);
        setUnits(result.data.text);
        setIsLoading(false);
      });
  };

  const calculateBillAmount = () => {
    let amount = 0;
    if (units <= 100) {
      amount = units <= 50 ? units * 1.95 : 50 * 1.95 + (units - 50) * 3.1;
    } else if (units <= 200) {
      amount = 100 * 3.4 + (units - 100) * 4.8;
    } else {
      amount = 100 * 3.4 + 100 * 4.8;
      if (units <= 300) {
        amount += (units - 200) * 7.7;
      } else if (units <= 400) {
        amount += 100 * 7.7 + (units - 300) * 9.0;
      } else if (units <= 800) {
        amount += 100 * 7.7 + 100 * 9.0 + (units - 400) * 9.5;
      } else {
        amount += 100 * 7.7 + 100 * 9.0 + 400 * 9.5 + (units - 800) * 10.0;
      }
    }
    setBillAmount(amount.toFixed(2));
    fixedCharges = amount + 10;
  };

  return (
    <div className="container">
      <div className="cards-container">
        <div className="col-md-5 mx-auto h-100 d-flex flex-column justify-content-center">
          {!isLoading && (
            <div className="camera-card">
              <Webcam className="webcam" audio={false} ref={webcamRef} />
              <div>
                <button
                  className="capture-icon"
                  type="button"
                  onClick={capture}
                ></button>
              </div>
            </div>
          )}
          {isLoading && (
            <>
              <progress className="form-control" value={progress} max="100">
                {progress}%{" "}
              </progress>{" "}
              <p className="text-center py-0 my-0">Converting:- {progress} %</p>
            </>
          )}
          {!isLoading && !units && (
            <div className="choose-file-container">
              <input
                className="file-input"
                type="file"
                onChange={(e) =>
                  setImage(URL.createObjectURL(e.target.files[0]))
                }
              />
              <div className="convert-container">
                <input
                  type="button"
                  onClick={handleSubmit}
                  className="convert"
                  value="Convert"
                />
              </div>
            </div>
          )}
          {!isLoading && units && (
            <>
              <textarea
                className="form-control w-100 mt-5"
                rows="2"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
              ></textarea>
            </>
          )}
          <div>
            <label className="input-label" htmlFor="units">
              Enter units consumed:
            </label>
            <input
              className="units-input"
              type="number"
              id="units"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
            />
            <div className="convert-container">
              <button className="button" onClick={calculateBillAmount}>
                Calculate Bill Amount
              </button>
            </div>
            <ul className="bill-details">
              <li className="li-elements">
                Energy charges: <span className="span">{billAmount}</span>
              </li>
              <li className="li-elements">
                Fixed Charges: <span className="span">{fixedCharges}</span>
              </li>
              <li className="li-elements">
                Customer Charges: <span className="span">{custCharges}</span>
              </li>
              <li className="li-elements">
                Electricity Duties: <span className="span">{elecDuties}</span>
              </li>
              <li className="li-elements">
                EDINT: <span className="span">{EDINT}</span>
              </li>
              <li className="li-elements">
                Additional Charges: <span className="span">{addlCharges}</span>
              </li>
              <li className="li-elements">
                ACD sur Charges: <span className="span">{surCharges}</span>
              </li>
              <li className="li-elements">
                INT on SD: <span className="span">{INT}</span>
              </li>
              <li className="li-elements">
                Loss/Gain: <span className="span">{lossGain}</span>
              </li>
              <li className="li-elements">
                Net Amount: <span className="span">{netAmount}</span>{" "}
              </li>
            </ul>
            <h1>Total Amount: </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
