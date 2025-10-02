import "./r.css";

const Regalo = () => {
  return (
    <div id="regalo" className="regalo">
      <div className="header_top">
        <img src="https://i.imgur.com/8wInKXb.png" className="toper" alt="" />
      </div>
      <div className="header_toper">
        <img src="https://i.imgur.com/8wInKXb.png" className="topers" alt="" />
      </div>
      <div className="regalo_grid">
        <div className="regalo_sub">
          <img
            src="https://i.imgur.com/2sOtSEW.png"
            alt=""
            className="regalo_img"
          />
        </div>
        <div className="regalo_sub tom">
          <h2 className="cer_title ">Regalo</h2>
          <br />
          <p className="bur sami">
            Il vostro affetto è il regalo più grande, ma se desiderate farci un
            dono, ecco le coordinate bancarie{" "}
          </p>

          <p className="bur  cami">
            iban:
            <br />
            intestato :
          </p>
        </div>
      </div>

      <div id="album" className="regalo_grid io">
        <div className="regalo_sub tom ttom">
          <h2 className="cer_title ">Foto della cerimonia</h2>
          <div className="ppp">
            <img
              src="https://i.imgur.com/9G2Dzx0.png"
              alt=""
              className="sorted_img"
            />
          </div>
          <p className="bur sami pami">
            durante la giornata di festa hai scattato qualche foto? caricale qui
          </p>
          <div className="pppp ">
            <button className="btn sss">CARICA FOTO</button>
          </div>
        </div>

        <div className="regalo_sub">
          <img
            src="https://i.imgur.com/B1wpcJN.jpeg"
            alt=""
            className="regalo_img"
          />
        </div>
      </div>
    </div>
  );
};

export default Regalo;
