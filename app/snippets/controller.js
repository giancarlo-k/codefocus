import { Snippet } from "./model.js"; 

export const createSnippet = async (req, res) => {
  try {
    const { name, language, createdAtFormatted, tags, favorite, code } = req.body;
  
    const username = req.session.user.username;
  
    const newSnippet = new Snippet({
      name,
      language,
      createdAt: new Date(),
      createdAtFormatted,
      username,
      tags,
      favorite,
      code
    });
  
    await newSnippet.save();
  
    res.status(200).json({
      message: 'Snippet created and added to database successfully!',
      snippet: newSnippet
    });

  } catch (err) {
    console.log(err)
  }
}

export const editSnippet = async (req, res) => {
  const { snippetID, formData } = req.body

  try {
    const editedSnippet = await Snippet.findOneAndUpdate(
      { _id: snippetID },
      { $set: formData },
      { new: true }
    )

    res.status(200).json({
      message: 'Snippet created and added to database successfully!',
      snippet: editedSnippet
    });
  } catch (err) { console.log(err) }
}

export const deleteSnippet = async (req, res) => {
  const { snippetID } = req.body;

  try {
    await Snippet.deleteOne({ _id: snippetID })
  } catch (err) {
    console.log(err)
  }
  
}

export const loadSnippets = async (req, res) => {
  const username = req.session.user.username;

  const snippets = await Snippet.find({ username })

  res.status(200).json({ snippets });
}

export const favoriteSnippet = async (req, res) => {
  const { snippetID, favorite } = req.body

  try {
    await Snippet.findOneAndUpdate(
      { _id: snippetID},
      { favorite },
      { new: true }
    )
    res.sendStatus(200);
  } catch (err) { console.log(err) };
};

export const saveCode = async (req, res) => {
  const { code, lineCount, snippetID } = req.body

  const now = new Date();
  let hours = now.getHours().toString().padStart(2, '0'); 
  const minutes = now.getMinutes().toString().padStart(2, '0'); 
  const meridiem = hours >= 12 ? 'PM' : "AM";
  hours = hours % 12 || 12;
  const lastSaved = `${hours}:${minutes} ${meridiem}`;

  try {
    await Snippet.findOneAndUpdate(
      { _id: snippetID},
      { code, lastSaved, lineCount },
      { new: true }
    )
    res.status(200).json({ lastSaved });
  } catch (err) { console.log(err) };
}



// async function deleteAllSnippets() {
//   await Snippet.deleteMany({});
// };

// deleteAllSnippets();