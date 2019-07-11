import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Box, Notification } from 'rbx';
import LoggedOut from 'pages/LoggedOut';
import MainScreen from 'pages/MainScreen';
import TestLogin from 'pages/TestLogin';
import { courseTracker } from 'utils/course';
import { useCachedUser } from 'hooks/useCachedUser';

const LoadScreen = ({ offering, testMode }) => {
  const [course, setCourse] = useState(null);
  const [user, setUser] = useCachedUser();
  debugger;

  useEffect(() => {
    return courseTracker(offering, setCourse);
  }, [offering]);

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
            ? <MainScreen user={user} setUser={setUser} course={course} />
            : testMode
              ? <TestLogin offering={ offering } setUser={ setUser } />
              : <LoggedOut />
      }
    </>
  );
};

export default LoadScreen;
