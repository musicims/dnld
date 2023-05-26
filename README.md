# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## This app is framework for compiling and exporting table data in PDF and excel format 

Has two customizable buttons for each export/save to file. Is currently configured for a two column dataset and three column export

## GPT integration for data

Example prompt to replace the data contained in the first const with a response from GPT API using 3.5 turbo

```
import openai

openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
        {"role": "system", "content": "You are a helpful assistant that provides information."},
        {"role": "user", "content": "Please provide a two-column formatted response similar to the preChecklistData."},
        {"role": "assistant", "content": "Sure! Here's a two-column formatted response:\n\n1. General Cleaning\n   - The property is clean and tidy.\n   - All surfaces are dust free and wiped, including countertops, shelves, and furniture.\n   - Windows and mirrors are clean.\n   - No personal belongings are present.\n2. Walls and Paint\n   - The walls are free of any marks, scuffs, or holes.\n   - Any minor damages are touched up with matching paint.\n   - If there are major damages, consult with the landlord or property manager.\n3. Floors and Carpets\n   - Inspect the floors for scratches, stains, or any damages.\n   - Vacuum or mop the floors accordingly.\n   - Professionally clean the carpets if necessary.\n4. Appliances and Fixtures\n   - Check that all appliances are in working order.\n   - Test the stove, refrigerator, dishwasher, microwave, and any other provided appliances.\n   - Ensure that all faucets, toilets, showers, and sinks are functioning properly.\n   - No missing or burnt out light bulbs\n\n...and so on."},
    ]
)

```

The output from the assistant then needs to be parsed, cleaned, and formatted similar to this example

```
// Assume the assistant's response is stored in a variable called 'assistantResponse'

const parseAssistantResponse = (assistantResponse) => {
  // Remove leading and trailing whitespace
  assistantResponse = assistantResponse.trim();

  // Split the response into individual lines
  const lines = assistantResponse.split('\n');

  // Initialize an empty array to store the parsed data
  const parsedData = [];

  // Iterate over each line
  lines.forEach((line) => {
    // Remove leading whitespace
    const trimmedLine = line.trim();

    // Check if the line starts with a number followed by a dot (e.g., "1.", "2.", etc.)
    const isNumberedItem = /^\d+\./.test(trimmedLine);

    if (isNumberedItem) {
      // Extract the number and content from the line
      const number = trimmedLine.match(/^\d+/)[0];
      const content = trimmedLine.substring(number.length + 1).trim();

      // Add the parsed item to the array
      parsedData.push([`${number}. ${content}`, '']);
    } else if (trimmedLine.startsWith('- ')) {
      // Remove the leading hyphen and trim the content
      const content = trimmedLine.substring(2).trim();

      // Add the parsed item to the array
      parsedData.push(['', content]);
    } else {
      // Ignore the line if it doesn't match the expected format
    }
  });

  // Return the parsed data array
  return parsedData;
};


const parsedData = parseAssistantResponse(assistantResponse);
console.log(parsedData); // The parsed data array

```