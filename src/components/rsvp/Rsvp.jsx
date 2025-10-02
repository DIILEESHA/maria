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
    bringingChildren: "no", // default to no
    childrenCount: 0,
    children: [], // [{ name: "", age: "" }, ...]
  });

  // Generic change for simple fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // When user toggles bringingChildren radio, reset children if switched to "no"
  const handleBringingChildrenChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      if (value === "no") {
        return { ...prev, bringingChildren: "no", childrenCount: 0, children: [] };
      }
      // keep existing children if switching to "yes"
      return { ...prev, bringingChildren: "yes" };
    });
  };

  // When user sets number of children
  const handleChildrenCountChange = (e) => {
    const raw = e.target.value;
    // ensure integer >= 0
    const count = Math.max(0, parseInt(raw === "" ? 0 : raw, 10) || 0);
    setFormData((prev) => {
      const newChildren = [...prev.children];

      // Increase length: push empty child objects
      if (count > newChildren.length) {
        for (let i = newChildren.length; i < count; i++) {
          newChildren.push({ name: "", age: "" });
        }
      } else if (count < newChildren.length) {
        // Decrease length: trim array
        newChildren.length = count;
      }

      return { ...prev, childrenCount: count, children: newChildren };
    });
  };

  // Update a specific child's field (name or age)
  const updateChild = (index, field, value) => {
    setFormData((prev) => {
      const newChildren = prev.children.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      );
      return { ...prev, children: newChildren };
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!attending) {
      toast.error("Seleziona SI o NO per favore!");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Il nome è obbligatorio!");
      return;
    }

    if (attending === "yes") {
      if (!formData.transfer.trim()) {
        toast.error("Per favore indica se usufruirai del transfer!");
        return;
      }
      if (formData.bringingChildren === "yes") {
        if (formData.childrenCount <= 0) {
          toast.error("Se porterai bambini, indica quanti!");
          return;
        }
        // Ensure each child has name and age
        for (let i = 0; i < formData.childrenCount; i++) {
          const child = formData.children[i];
          if (!child || !String(child.name || "").trim()) {
            toast.error(`Inserisci il nome del bambino #${i + 1}`);
            return;
          }
          if (child.age === "" || child.age === null) {
            toast.error(`Inserisci l'età del bambino #${i + 1}`);
            return;
          }
          // optional: ensure age is a positive integer
          const ageNum = parseInt(child.age, 10);
          if (isNaN(ageNum) || ageNum < 0) {
            toast.error(`Inserisci un'età valida per il bambino #${i + 1}`);
            return;
          }
        }
      }
    }

    // Prepare payload: children as array of { name, age }
    const payload = {
      attending,
      name: formData.name,
      allergies: formData.allergies,
      transfer: formData.transfer,
      message: formData.message,
      bringingChildren: formData.bringingChildren,
      children: formData.bringingChildren === "yes" ? formData.children : [],
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "rsvpResponses"), payload);
      toast.success("RSVP inviato con successo!");
      // reset
      setFormData({
        name: "",
        allergies: "",
        transfer: "",
        message: "",
        bringingChildren: "no",
        childrenCount: 0,
        children: [],
      });
      setAttending(null);
    } catch (error) {
      console.error(error);
      toast.error("Errore nell'invio. Riprova!");
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

            {/* Name input - always visible */}
            <div className="inputers">
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="NOME E COGNOME"
                className="input_other"
                onChange={handleChange}
              />
            </div>

            {/* Only show if attending */}
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
                    placeholder="Usufruirai del trasfer per la location?"
                    className="input_other"
                    onChange={handleChange}
                  />
                </div>

                {/* Children question */}
                <div className="inputers">
                  <label style={{ textAlign: "left" }} className="psw">
                    Porterai dei bambini?
                  </label>
                  <div className="tower tuu">
                    <div className="tower_sec">
                      <input
                        type="radio"
                        id="childrenYes"
                        name="bringingChildren"
                        value="yes"
                        checked={formData.bringingChildren === "yes"}
                        onChange={handleBringingChildrenChange}
                      />
                      <label htmlFor="childrenYes">SI</label>
                    </div>
                    <div className="tower_sec">
                      <input
                        type="radio"
                        id="childrenNo"
                        name="bringingChildren"
                        value="no"
                        checked={formData.bringingChildren === "no"}
                        onChange={handleBringingChildrenChange}
                      />
                      <label htmlFor="childrenNo">NO</label>
                    </div>
                  </div>
                </div>

                {/* If yes: ask how many */}
                {formData.bringingChildren === "yes" && (
                  <>
                    <div className="inputers">
                      <input
                        type="number"
                        name="childrenCount"
                        min="1"
                        max="10"
                        value={formData.childrenCount}
                        placeholder="Quanti bambini porterai?"
                        className="input_other"
                        onChange={handleChildrenCountChange}
                      />
                    </div>

                    {/* Render dynamic child inputs */}
                    {formData.childrenCount > 0 &&
                      formData.children.map((child, idx) => (
                        <div className="inputers" key={`child-${idx}`}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <input
                              type="text"
                              value={child.name}
                              placeholder={`Nome bambino #${idx + 1}`}
                              className="input_other"
                              onChange={(e) => updateChild(idx, "name", e.target.value)}
                              style={{ flex: "1 1 60%" }}
                            />
                            <input
                              type="number"
                              min="0"
                              value={child.age}
                              placeholder={`Età #${idx + 1}`}
                              className="input_other"
                              onChange={(e) => updateChild(idx, "age", e.target.value)}
                              style={{ width: 120 }}
                            />
                          </div>
                        </div>
                      ))}
                  </>
                )}
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
              INVIA la risposta
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Rsvp;
