import React, { useEffect } from 'react';
import 'rbx/index.css';
import { Box, Notification } from 'rbx';
import LoggedOut from 'pages/LoggedOut';
import MainScreen from 'pages/MainScreen';
import TestLogin from 'pages/TestLogin';
import { courseTracker, offeringCourse } from 'utils/course';
import { useCachedValue } from 'hooks/useCachedValue';

const LoadScreen = ({ offering, testMode }) => {
  const expiration = testMode ? 0 : 24 * 60 * 60 * 1000;
  const [courseName, setCourseName] = useCachedValue('cachedCourseName', expiration);
  const [course, setCourse] = useCachedValue('cachedCourse', expiration);
  const [user, setUser] = useCachedValue('cachedUser', expiration);

  useEffect(() => {
    const getCourseName = async (offering) => {
      const name = await offeringCourse(offering);
      setCourseName(name);
    };
    getCourseName(offering);
  }, [offering, setCourseName]);

  useEffect(() => {
    if (courseName) return courseTracker(courseName, setCourse);
  }, [courseName, setCourse]);

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
