import "./r.css";
import { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Rsvp = () => {
  const [attending, setAttending] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    allergies: "",
    transfer: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!attending) {
      toast.error("Please select Yes or No!");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Name is required!");
      return;
    }
    if (attending === "yes") {
      if (!formData.transfer.trim()) {
        toast.error("Please mention transfer option!");
        return;
      }
    }

    try {
      await addDoc(collection(db, "rsvpResponses"), {
        attending,
        ...formData,
        createdAt: new Date(),
      });
      toast.success("RSVP submitted successfully!");
      setFormData({ name: "", allergies: "", transfer: "", message: "" });
      setAttending(null);
    } catch (error) {
      toast.error("Error submitting RSVP. Try again!");
      console.error(error);
    }
  };

  return (
    <div className="rsvp">
      <div className="rsvp_grid">
        <div className="rsvp_sub sure">
          <h2 className="cer_title habiyo">Conferma la tua presenza</h2>
          <h2 className="cer_date vol">
            Per favore, conferma la tua presenza, per noi è importante
          </h2>
        </div>

        <div className="rsvp_sub">
          <div className="rsvp_form">
            <div className="tower">
              <div className="tower_sec">
                <input
                  type="radio"
                  id="yes"
                  name="attending"
                  value="yes"
                  checked={attending === "yes"}
                  onChange={() => setAttending("yes")}
                  className="rsvp_inout"
                />
                <label htmlFor="yes" className="rsvp_label">
                  SI, CI SONO
                </label>
              </div>

              <div className="tower_sec">
                <input
                  type="radio"
                  id="no"
                  name="attending"
                  value="no"
                  checked={attending === "no"}
                  onChange={() => setAttending("no")}
                  className="rsvp_inout"
                />
                <label htmlFor="no" className="rsvp_label">
                  NO, NON CI SONO
                </label>
              </div>
            </div>

            {/* Common Input (always visible) */}
            <div className="inputers">
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="NOME E COGMONE"
                className="input_other"
                onChange={handleChange}
              />
            </div>

            {/* Only show if attending === yes */}
            {attending === "yes" && (
              <>
                <div className="inputers">
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    placeholder="ALLERGIE O INTOLLERANZE ALIMENTARI"
                    className="input_other"
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="inputers">
                  <input
                    type="text"
                    name="transfer"
                    value={formData.transfer}
                    placeholder="usufrirai delTrasfert per la location?*"
                    className="input_other"
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {/* Message - always visible */}
            <div className="inputers">
              <textarea
                name="message"
                value={formData.message}
                placeholder="MESSAGGIO PER GLI SPOSI"
                className="input_other"
                onChange={handleChange}
              ></textarea>
            </div>

            <button className="btn hhh" onClick={handleSubmit}>
              INVIa la risposta
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Rsvp;
