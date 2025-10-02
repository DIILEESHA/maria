import "./cer.css";

const Ceremony = () => {
  return (
    <div id="dettagli" className="cc">
      <div className="header_top">
        <img src="https://i.imgur.com/8wInKXb.png" className="toper" alt="" />
      </div>
      <div className="header_toper">
        <img src="https://i.imgur.com/8wInKXb.png" className="topers" alt="" />
      </div>
      <h2 className="cer_title">La Cerimonia</h2>
      <div className="ceremony_grid">
        <div className="cer_sub hhp">
          <img
            src="https://i.imgur.com/hxHl34o.png"
            alt=""
            className="cer_img"
          />
        </div>
        <div className="cer_sub vv">
          <h2 className="cer_date">19 DICEMBRE ALLE ORE 10:30</h2>
          <h2 className="cer_dates">presso</h2>

          <p className="main_title">Santuario di Sant Antimo Prete e Martire</p>

          <p className="bur">Piazza della Repubblica , Sant’ Antimo (NA)</p>

          <button className="btn">google maps</button>
        </div>
      </div>
    </div>
  );
};

export default Ceremony;
