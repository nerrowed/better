import { Route, Routes } from 'react-router';
import { LoginPage } from './app/auth/login-page';
import AuthLayout from './app/auth/_layout';
import LayoutDashoard from './app/dashboard/_layout';
import ListAccountStudent from './app/dashboard/account/student/page-list';
import FormAccountStudent from './app/dashboard/account/student/page-form';
import ListAccountLecturers from './app/dashboard/account/lecturer/page-list';
import FormAccountLecturers from './app/dashboard/account/lecturer/page-form';
import MentoringPlottingPage from './app/dashboard/plotting/lecturers/mentoring-plotting-page';
import MentoringScheduleLecturer from './app/dashboard/schedule/mentoring-schedule-lecturer';
import RequestLecturerPlottingPage from './app/dashboard/plotting/lecturers/request-lecture-plotting-page';
import DashboardHome from './app/dashboard/home';
import SettingPage from './app/dashboard/setting/setting-page';
import FinaleExaminationPlottingPage from './app/dashboard/plotting/examination/finale-examination-plotting-page';
import ListFinaleExamRooms from './app/dashboard/plotting/examination/rooms/page-list';
import FormFinaleExamRooms from './app/dashboard/plotting/examination/rooms/page-form';
import ListFinaleExamExaminerRole from './app/dashboard/plotting/examination/examiner-role/page-list';
import FormFinaleExamExaminerRole from './app/dashboard/plotting/examination/examiner-role/page-form';
import FinaleExaminationPage from './app/dashboard/plotting/examination/finale-examination-page';
import LimitLecturerPage from './app/dashboard/plotting/lecturers/limit/limit-lecturer-page';

function RoutesPage() {
  return (
    <Routes>
      <Route path="/" element={<LayoutDashoard />}>
        <Route index element={<DashboardHome />} />
        <Route path="account">
          <Route path="students">
            <Route index element={<ListAccountStudent />} />
            <Route path="c" element={<FormAccountStudent />} />
            <Route path="e/:id" element={<FormAccountStudent />} />
            <Route path=":id" element={<h1>Hai 2</h1>} />
          </Route>

          <Route path="lecturers">
            <Route index element={<ListAccountLecturers />} />
            <Route path="c" element={<FormAccountLecturers />} />
            <Route path="e/:id" element={<FormAccountLecturers />} />
            <Route path=":id" element={<h1>Hai 2</h1>} />
          </Route>
        </Route>

        <Route path="setting" element={<SettingPage />} />

        <Route path="plotting">
          <Route path="lecturers" element={<MentoringPlottingPage />} />
          <Route path="lecturers/limit" element={<LimitLecturerPage />} />
        </Route>

        <Route path="finale-examination">
          <Route path="schedule" element={<FinaleExaminationPlottingPage />} />
          <Route path="examiner-role">
            <Route index element={<ListFinaleExamExaminerRole />} />
            <Route path="c" element={<FormFinaleExamExaminerRole />} />
            <Route path="e/:id" element={<FormFinaleExamExaminerRole />} />
          </Route>
          <Route path="rooms">
            <Route index element={<ListFinaleExamRooms />} />
            <Route path="c" element={<FormFinaleExamRooms />} />
            <Route path="e/:id" element={<FormFinaleExamRooms />} />
          </Route>
        </Route>

        {/* Student Routes */}
        <Route path="request-lecturer" element={<RequestLecturerPlottingPage />} />
        <Route path="mentoring-schedule" element={<MentoringScheduleLecturer />} />
        <Route path="finale-examination-schedule" element={<FinaleExaminationPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        {/* <Route path="register" element={<Register />} /> */}
      </Route>
    </Routes>
  );
}

export default RoutesPage;
