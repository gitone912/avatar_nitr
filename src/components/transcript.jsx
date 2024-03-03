// import React, { useState, useEffect } from 'react';

// function transcript1() {
//   const [transcription, setTranscription] = useState(null);

//   useEffect(() => {
//     // Make a request to your Django API endpoint
//     fetch('/your-django-api-endpoint/')
//       .then(response => response.json())
//       .then(data => {
//         if (data.status === 'success') {
//           // Set the transcription in the state
//           setTranscription(data.transcription);
//         } else {
//           // Handle the error case
//           console.error(data.message);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching transcription:', error);
//       });
//   }, []);

//   return (
//     <div>
//       {transcription ? (
//         <p>Transcription: {transcription}</p>
//       ) : (
//         <p>Loading transcription...</p>
//       )}
//     </div>
//   );
// }

// export default transcript1;
