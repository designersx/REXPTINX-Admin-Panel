// import React, { useEffect } from "react";
// import { gapi } from 'gapi-script';
// const CLIENT_ID = '899463709937-6m4pj4dcq13a8bbt1vtpe37vj1q1r1o0.apps.googleusercontent.com';
// const API_KEY = 'AIzaSyC4lQWKpatGfSNqaVNKFwwxm7_7GyQmy_4';
// const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
// const CheckGoogleCalendar = () => {
//   useEffect(() => {
//     const initClient = () => {
//       gapi.client.init({
//         apiKey: API_KEY,
//         clientId: CLIENT_ID,
//         scope: SCOPES,
//         discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
//       }).then(() => {
//         // Optionally check if already signed in
//         const authInstance = gapi.auth2.getAuthInstance();
//         if (authInstance.isSignedIn.get()) {
//           console.log("User is already signed in");
//         }
//       }, (error) => {
//         console.error("gapi client init error", error);
//       });
//     };

//     gapi.load('client:auth2', initClient);
//   }, []);
//   const handleSyncClick = () => {
//     const authInstance = gapi.auth2.getAuthInstance();
//     authInstance.signIn().then(() => {
//       const event = {
//         summary: 'GuardX Calendar Sync Test',
//         location: 'Online',
//         description: 'This event was added via web app',
//         start: {
//           dateTime: '2025-06-21T10:00:00+05:30',
//           timeZone: 'Asia/Kolkata',
//         },
//         end: {
//           dateTime: '2025-06-21T11:00:00+05:30',
//           timeZone: 'Asia/Kolkata',
//         },
//       };

//       const request = gapi.client.calendar.events.insert({
//         calendarId: 'primary',
//         resource: event,
//       });

//       request.execute((event) => {
//         alert(`✅ Event Created: ${event.htmlLink}`);
//       });
//     }).catch((error) => {
//       console.error("Sign-in error", error);
//       alert("❌ Failed to sign in with Google");
//     });
//   };

//   return (
//     <div>
//       <button onClick={handleSyncClick}>
//         Sync with Google Calendar
//       </button>
//     </div>
//   );
// };
// export default CheckGoogleCalendar;
import React from 'react';

const events = [
  {
    title: 'Welcome Meeting',
    description: 'Initial project kickoff with team.',
    location: 'Zoom',
    start: '20250523T090000Z',
    end: '20250523T100000Z',
  },
  {
    title: 'Design Review',
    description: 'Review the new UI/UX design proposals.',
    location: 'Google Meet',
    start: '20250524T130000Z',
    end: '20250524T140000Z',
  },
  {
    title: 'Code Freeze',
    description: 'Final code freeze before production deployment.',
    location: 'Slack Call',
    start: '20250525T150000Z',
    end: '20250525T160000Z',
  },
];

const CalendarEvent = () => {
  const generateGoogleCalendarUrl = (event) => {
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${event.start}/${event.end}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`;
  };

  const generateICS = () => {
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n`;

    events.forEach((event, idx) => {
      const uid = `${event.title.replace(/\s+/g, '_')}-${idx}@yourapp.com;
      icsContent += BEGIN:VEVENT\nUID:${uid}\nSUMMARY:${event.title}\nDESCRIPTION:${event.description}\nLOCATION:${event.location}\nDTSTART:${event.start}\nDTEND:${event.end}\nEND:VEVENT\n`;
    });

    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `events_batch.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const feedHttp = 'http://localhost:5000/api/feed.ics'; // your backend-generated ICS feed
  const webcalUrl = feedHttp.replace(/^https?:\/\//, 'webcal://');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Upcoming Events</h1>
      {events.map((event, index) => (
        <div key={index} className="border p-4 rounded shadow space-y-1">
          <h2 className="font-semibold">{event.title}</h2>
          <p><strong>Description:</strong> {event.description}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Time:</strong> {event.start} to {event.end}</p>
          <a
            href={generateGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 bg-blue-500 text-white px-3 py-1 rounded"
          >
            ➕ Add to Google Calendar
          </a>
        </div>
      ))}
      <div className="pt-4 space-x-4">
        <button
          onClick={generateICS}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          📥 Download All Events (.ics)
        </button>

        <a href={webcalUrl}>
          <button className="bg-gray-700 text-white px-4 py-2 rounded">
            🔔 Subscribe in Apple Calendar
          </button>
        </a>
      </div>
    </div>
  );
};

export default CalendarEvent;