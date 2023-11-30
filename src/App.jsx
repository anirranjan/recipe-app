import { db } from "./firebase.config";
import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, addDoc, deleteDoc } from "firebase/firestore";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({
    meal: "",
    instructions: "",
  });
  const [popup, setPopup] = useState(false);

  const recipeCollectionRef = collection(db, "recipes");

  useEffect(() => {
    onSnapshot(recipeCollectionRef, (snapshot) => {
      setRecipes(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        })
      );
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    addDoc(recipeCollectionRef, form)
    setForm({
      meal: "",
      instructions: ""
    })

    setPopup(false)
  };

  const removeRecipe = id => {
    deleteDoc(doc(db, "recipes", id))
  }

  return (
    <div className="App">
      <h1>My Recipes</h1>
      <button className="bottom-right" onClick={() => setPopup(!popup)}>Add recipe</button>

      <div className="recipes">
        {recipes.map((recipe) => (
          <div className="recipe" key={recipe.id}>
            <h3>{recipe.meal}</h3>
            <p>{recipe.instructions}</p>

            <div className="buttons">
              <button className="remove" onClick = {() => removeRecipe(recipe.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {popup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add a new recipe</h2>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Meal</label>
                <input
                  type="text"
                  value={form.meal}
                  onChange={(e) => setForm({ ...form, meal: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Instructions</label>
                <textarea
                  type="text"
                  value={form.instructions}
                  onChange={(e) =>
                    setForm({ ...form, instructions: e.target.value })
                  }
                  required
                />
              </div>

              <div className="buttons">
                <button type="submit">Submit</button>
                <button type="button" className="remove" onClick={() => setPopup(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
