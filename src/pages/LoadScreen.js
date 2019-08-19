import React from 'react';
import 'rbx/index.css';
import { Box, Notification } from 'rbx';
import LoggedOut from 'pages/LoggedOut';
import MainScreen from 'pages/MainScreen';
import TestLogin from 'pages/TestLogin';
import { useCachedValue } from 'hooks/useCachedValue';
import { useFirebase, useFirebaseValue } from 'hooks/useFirebase';


const LoadScreen = ({ offering, testMode }) => {
  console.log(`Offering = "${offering}; Test mode is ${!!testMode}`);
  const expiration = testMode ? 0 : 24 * 60 * 60 * 1000;
  const [courseName, setCourseName] = useCachedValue('cachedCourseName', expiration);
  const [course, setCourse] = useCachedValue('cachedCourse', expiration);
  const [user, setUser] = useCachedValue('cachedUser', expiration);

  console.log(`Cached course: "${courseName}; Cached user: ${user ? user.displayName : "N/A"}`);
  useFirebase(`courses/${courseName}`, setCourse);
  useFirebaseValue(offering ? `offerings/${offering}/course` : null, setCourseName);

  return (
    <>
      {
         testMode
          ? <Notification color="warning">
              This is a page for app testing only.
            </Notification>
          : null
       }
      {
        !course
          ? <Box>Loading class data...</Box>
          : user
            ? <MainScreen user={user} setUser={setUser} offering= { offering } course={course} />
            : testMode
              ? <TestLogin offering={ offering } setUser={ setUser } />
              : <LoggedOut />
      }
    </>
  );
};

export default LoadScreen;
