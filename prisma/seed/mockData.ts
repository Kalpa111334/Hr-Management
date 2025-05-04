import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const splitSql = (sql: string) => {
  return sql.split(';').filter(content => content.trim() !== '')
}

async function main() {
  const sql = `

INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('e8913cc8-200c-4e0d-9d94-5ac2038c930a', '1Bernie.Ryan@yahoo.com', 'John Doe', 'https://i.imgur.com/YfJQV5z.png?id=3', 'ghi890jkl123mno456', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('24aba723-8c29-45f8-8de3-eb97984e72b6', '17Jamarcus_Rath15@hotmail.com', 'Michael Brown', 'https://i.imgur.com/YfJQV5z.png?id=19', 'abc123def456ghi789', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('771705ee-0807-4d6f-96f6-51fc9219ac9f', '25Gabe.Green34@gmail.com', 'John Doe', 'https://i.imgur.com/YfJQV5z.png?id=27', 'stu901vwx234yz567', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('1341297c-d920-443c-b19e-bc112d00a82c', '33Wilber43@hotmail.com', 'Michael Brown', 'https://i.imgur.com/YfJQV5z.png?id=35', 'abc123def456ghi789', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('7e542c26-e366-4025-907a-4e8ec7e9ca7d', '41Therese_Reinger@yahoo.com', 'Jane Smith', 'https://i.imgur.com/YfJQV5z.png?id=43', 'stu901vwx234yz567', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('cc0105fd-bca3-4b84-a66b-02e697fc3424', '49Santina_Kub44@yahoo.com', 'Michael Brown', 'https://i.imgur.com/YfJQV5z.png?id=51', 'stu901vwx234yz567', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('59dfaa73-6fe6-4df5-9fd2-15a1ef90e775', '57Furman_Quigley25@hotmail.com', 'John Doe', 'https://i.imgur.com/YfJQV5z.png?id=59', 'pqr789stu012vwx345', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('5045189e-1969-4fa8-b394-f2bd225cd6cd', '65Alden.Pacocha@yahoo.com', 'John Doe', 'https://i.imgur.com/YfJQV5z.png?id=67', 'pqr789stu012vwx345', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('2d8fefa5-fbcb-4566-8204-296db0f1d283', '73Darby85@hotmail.com', 'Emily Jones', 'https://i.imgur.com/YfJQV5z.png?id=75', 'abc123def456ghi789', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');

INSERT INTO "WorkShift" ("id", "name", "startTime", "endTime", "breakDuration", "overtimeThreshold") VALUES ('42a418d6-81a3-4522-96a0-fdc21c6dd441', 'Morning Shift', '0800', '2200', 260, 351);
INSERT INTO "WorkShift" ("id", "name", "startTime", "endTime", "breakDuration", "overtimeThreshold") VALUES ('a69aaa78-cc87-4837-bd6d-29856357c7a5', 'Afternoon Shift', '1400', '2200', 673, 308);
INSERT INTO "WorkShift" ("id", "name", "startTime", "endTime", "breakDuration", "overtimeThreshold") VALUES ('62b4c97f-7fcd-4bbd-92bb-c66905022bdd', 'Morning Shift', '2200', '1800', 750, 71);
INSERT INTO "WorkShift" ("id", "name", "startTime", "endTime", "breakDuration", "overtimeThreshold") VALUES ('cd18cf33-6906-40d4-9cf0-767a11345667', 'Morning Shift', '0800', '0600', 318, 547);
INSERT INTO "WorkShift" ("id", "name", "startTime", "endTime", "breakDuration", "overtimeThreshold") VALUES ('270fb6bd-2915-47c2-bb01-02a797ae9d8e', 'Flexible Shift', '1400', '0600', 315, 27);
INSERT INTO "WorkShift" ("id", "name", "startTime", "endTime", "breakDuration", "overtimeThreshold") VALUES ('f6c11633-cc46-4299-be37-a7a922ea36db', 'Weekend Shift', '0930', '1730', 138, 205);
INSERT INTO "WorkShift" ("id", "name", "startTime", "endTime", "breakDuration", "overtimeThreshold") VALUES ('48cf773f-f2cb-4b60-a4ae-11a41b5ce8f4', 'Morning Shift', '1000', '0600', 735, 991);
INSERT INTO "WorkShift" ("id", "name", "startTime", "endTime", "breakDuration", "overtimeThreshold") VALUES ('828e3b01-a3b6-4a0a-9253-f1019b9065b4', 'Night Shift', '1000', '1600', 438, 945);
INSERT INTO "WorkShift" ("id", "name", "startTime", "endTime", "breakDuration", "overtimeThreshold") VALUES ('f30b50a3-5004-42db-a1b9-91fab271374d', 'Night Shift', '0930', '1600', 162, 425);
INSERT INTO "WorkShift" ("id", "name", "startTime", "endTime", "breakDuration", "overtimeThreshold") VALUES ('b1e1340d-a230-4f66-b94a-dfdda1158a06', 'Weekend Shift', '2200', '1730', 469, 20);

INSERT INTO "LeaveType" ("id", "name", "description", "daysAllowed", "carryForward", "documentRequired") VALUES ('2400c7c7-cbcb-44e8-b148-5bf88ccb5e67', 'Bereavement Leave', 'Leave for childbirth and recovery', 578, false, false);
INSERT INTO "LeaveType" ("id", "name", "description", "daysAllowed", "carryForward", "documentRequired") VALUES ('9abbda1b-38ac-4434-b51d-f7dfc03eaa94', 'Sick Leave', 'Leave for childbirth and recovery', 44, false, false);
INSERT INTO "LeaveType" ("id", "name", "description", "daysAllowed", "carryForward", "documentRequired") VALUES ('9023617f-4c0a-43d0-9cc5-4b3646d16211', 'Annual Leave', 'Leave for childbirth and recovery', 921, true, false);
INSERT INTO "LeaveType" ("id", "name", "description", "daysAllowed", "carryForward", "documentRequired") VALUES ('c94882b9-583e-4fb4-9245-a83e5043a6e5', 'Bereavement Leave', 'Leave for vacation or personal time off', 620, true, false);
INSERT INTO "LeaveType" ("id", "name", "description", "daysAllowed", "carryForward", "documentRequired") VALUES ('c7cb4c91-3208-4008-a119-6b73d148f386', 'Annual Leave', 'Leave for new fathers after childbirth', 391, false, false);
INSERT INTO "LeaveType" ("id", "name", "description", "daysAllowed", "carryForward", "documentRequired") VALUES ('523e72ae-4a6b-4fb7-bb73-b1b8a0476e1f', 'Paternity Leave', 'Leave for vacation or personal time off', 665, true, true);
INSERT INTO "LeaveType" ("id", "name", "description", "daysAllowed", "carryForward", "documentRequired") VALUES ('ce8c48d2-440e-4476-9a95-f13dc5df3774', 'Annual Leave', 'Leave for childbirth and recovery', 302, true, true);
INSERT INTO "LeaveType" ("id", "name", "description", "daysAllowed", "carryForward", "documentRequired") VALUES ('5ceadbb3-ed4e-479e-8e40-62da9c78dd2d', 'Sick Leave', 'Leave for new fathers after childbirth', 754, true, true);
INSERT INTO "LeaveType" ("id", "name", "description", "daysAllowed", "carryForward", "documentRequired") VALUES ('bc356485-3dfe-45d1-b0b1-027acf35349c', 'Sick Leave', 'Leave for vacation or personal time off', 240, false, true);
INSERT INTO "LeaveType" ("id", "name", "description", "daysAllowed", "carryForward", "documentRequired") VALUES ('a669159a-998f-4643-8381-8cce0335a220', 'Paternity Leave', 'Leave for childbirth and recovery', 715, true, true);

INSERT INTO "OfficeLocation" ("id", "name", "address", "latitude", "longitude", "radius") VALUES ('9cd384bc-5bc5-4b2c-af91-91fe5915e345', 'Tech Park', '202 18 Spring St, New York, NY 10012', '34.052235', '118.243683', 39);
INSERT INTO "OfficeLocation" ("id", "name", "address", "latitude", "longitude", "radius") VALUES ('48c30130-886a-4532-b5ff-95ff262b7d2d', 'Branch A', '208 18 Spring St, New York, NY 10012', '40.712776', '0.127758', 709);
INSERT INTO "OfficeLocation" ("id", "name", "address", "latitude", "longitude", "radius") VALUES ('3e88b406-2d9b-4664-8573-0b7febeda8d1', 'Tech Park', '214 136 E 13th St, New York, NY 10003', '34.052235', '122.419418', 88);
INSERT INTO "OfficeLocation" ("id", "name", "address", "latitude", "longitude", "radius") VALUES ('04997d33-45fd-4b5c-8e84-d319d5afb38c', 'Tech Park', '220 91 Christopher St, New York, NY 10014', '34.052235', '122.419418', 55);
INSERT INTO "OfficeLocation" ("id", "name", "address", "latitude", "longitude", "radius") VALUES ('c75bf3d2-3be0-4fb8-98c6-344d82c64697', 'Corporate HQ', '226 443 E 6th St, New York, NY 10009', '40.712776', '87.629799', 272);
INSERT INTO "OfficeLocation" ("id", "name", "address", "latitude", "longitude", "radius") VALUES ('029b85be-1bd2-4e40-a82f-a46c766ce044', 'Branch A', '232 443 E 6th St, New York, NY 10009', '34.052235', '0.127758', 472);
INSERT INTO "OfficeLocation" ("id", "name", "address", "latitude", "longitude", "radius") VALUES ('9bfdd3b8-6513-44f1-a442-1fc6ba81e510', 'Tech Park', '238 18 Spring St, New York, NY 10012', '51.507351', '87.629799', 701);
INSERT INTO "OfficeLocation" ("id", "name", "address", "latitude", "longitude", "radius") VALUES ('1f6a870d-7ab9-4865-9ac0-0d37b9f8acad', 'Main Office', '244 330 W Broadway, New York, NY 10013', '40.712776', '74.005974', 37);
INSERT INTO "OfficeLocation" ("id", "name", "address", "latitude", "longitude", "radius") VALUES ('c61c2d58-27b2-4311-82e3-9bf3f15616b6', 'Branch A', '250 42 E 20th St, New York, NY 10003', '41.878113', '0.127758', 164);
INSERT INTO "OfficeLocation" ("id", "name", "address", "latitude", "longitude", "radius") VALUES ('2f7fc716-daee-4e22-a295-665b96b1f27c', 'Corporate HQ', '256 136 E 13th St, New York, NY 10003', '34.052235', '118.243683', 855);

INSERT INTO "Team" ("id", "departmentName", "managerId", "shiftId") VALUES ('283a69ee-a7fa-47e5-837f-547059021693', 'Finance', '1341297c-d920-443c-b19e-bc112d00a82c', '62b4c97f-7fcd-4bbd-92bb-c66905022bdd');
INSERT INTO "Team" ("id", "departmentName", "managerId", "shiftId") VALUES ('a6328ab2-c42f-4ef3-b634-08cebf21cc3d', 'Sales', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc', 'f6c11633-cc46-4299-be37-a7a922ea36db');
INSERT INTO "Team" ("id", "departmentName", "managerId", "shiftId") VALUES ('1729d286-cbe3-48e7-aa86-479f7c8d53ea', 'Sales', 'cc0105fd-bca3-4b84-a66b-02e697fc3424', '48cf773f-f2cb-4b60-a4ae-11a41b5ce8f4');
INSERT INTO "Team" ("id", "departmentName", "managerId", "shiftId") VALUES ('556b784d-9174-4f11-921e-1cdc73b20b97', 'Sales', '1341297c-d920-443c-b19e-bc112d00a82c', 'f30b50a3-5004-42db-a1b9-91fab271374d');
INSERT INTO "Team" ("id", "departmentName", "managerId", "shiftId") VALUES ('70764b24-394d-41df-a390-03dc975269b0', 'Engineering', '7e542c26-e366-4025-907a-4e8ec7e9ca7d', 'f30b50a3-5004-42db-a1b9-91fab271374d');
INSERT INTO "Team" ("id", "departmentName", "managerId", "shiftId") VALUES ('e77e8ed3-806d-42a5-a316-228430716991', 'Engineering', '59dfaa73-6fe6-4df5-9fd2-15a1ef90e775', '270fb6bd-2915-47c2-bb01-02a797ae9d8e');
INSERT INTO "Team" ("id", "departmentName", "managerId", "shiftId") VALUES ('8c61e506-6521-4001-a030-b601911ff9ef', 'Marketing', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc', 'cd18cf33-6906-40d4-9cf0-767a11345667');
INSERT INTO "Team" ("id", "departmentName", "managerId", "shiftId") VALUES ('24995d9c-f6ca-42f0-9c6f-361bd7f5e185', 'Marketing', 'e8913cc8-200c-4e0d-9d94-5ac2038c930a', '828e3b01-a3b6-4a0a-9253-f1019b9065b4');
INSERT INTO "Team" ("id", "departmentName", "managerId", "shiftId") VALUES ('4ff11af9-b7ed-4fc5-85b8-6795037f0f7f', 'Marketing', '5045189e-1969-4fa8-b394-f2bd225cd6cd', '48cf773f-f2cb-4b60-a4ae-11a41b5ce8f4');
INSERT INTO "Team" ("id", "departmentName", "managerId", "shiftId") VALUES ('e096551a-2e9f-4b8b-baf0-409443b9b713', 'Engineering', '771705ee-0807-4d6f-96f6-51fc9219ac9f', 'f6c11633-cc46-4299-be37-a7a922ea36db');

INSERT INTO "TeamMember" ("id", "teamId", "userId") VALUES ('c15c2792-dfc6-4114-8b28-3fc914264bdb', 'e77e8ed3-806d-42a5-a316-228430716991', '24aba723-8c29-45f8-8de3-eb97984e72b6');
INSERT INTO "TeamMember" ("id", "teamId", "userId") VALUES ('f1bb1819-c23e-4350-9433-f9407f872171', '70764b24-394d-41df-a390-03dc975269b0', '771705ee-0807-4d6f-96f6-51fc9219ac9f');
INSERT INTO "TeamMember" ("id", "teamId", "userId") VALUES ('dff46cfd-7034-4ac3-ba21-5e5980c3c8d5', 'e77e8ed3-806d-42a5-a316-228430716991', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc');
INSERT INTO "TeamMember" ("id", "teamId", "userId") VALUES ('b4550faa-bf9f-40e5-9ac2-c377590eadda', '1729d286-cbe3-48e7-aa86-479f7c8d53ea', '771705ee-0807-4d6f-96f6-51fc9219ac9f');
INSERT INTO "TeamMember" ("id", "teamId", "userId") VALUES ('e62cd824-629a-4399-a503-02c737389dd3', '283a69ee-a7fa-47e5-837f-547059021693', '24aba723-8c29-45f8-8de3-eb97984e72b6');
INSERT INTO "TeamMember" ("id", "teamId", "userId") VALUES ('04338211-f5e8-441d-8e6a-a33c1c5a5ba7', '4ff11af9-b7ed-4fc5-85b8-6795037f0f7f', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc');
INSERT INTO "TeamMember" ("id", "teamId", "userId") VALUES ('594efecb-b74e-43fd-9de4-7b98f226cb13', '4ff11af9-b7ed-4fc5-85b8-6795037f0f7f', '771705ee-0807-4d6f-96f6-51fc9219ac9f');
INSERT INTO "TeamMember" ("id", "teamId", "userId") VALUES ('274e3a3d-65b2-47c2-915b-7416b3fd6c3d', '24995d9c-f6ca-42f0-9c6f-361bd7f5e185', '7e542c26-e366-4025-907a-4e8ec7e9ca7d');
INSERT INTO "TeamMember" ("id", "teamId", "userId") VALUES ('2ff14dfe-e858-424f-bced-ed4cc4fd849c', 'e096551a-2e9f-4b8b-baf0-409443b9b713', '59dfaa73-6fe6-4df5-9fd2-15a1ef90e775');
INSERT INTO "TeamMember" ("id", "teamId", "userId") VALUES ('c03d17a2-ad50-40ba-ba0a-50c366133cc4', '70764b24-394d-41df-a390-03dc975269b0', '771705ee-0807-4d6f-96f6-51fc9219ac9f');

INSERT INTO "Attendance" ("id", "checkInTime", "checkOutTime", "status", "manualReason", "userId", "locationId") VALUES ('d6f03ce0-0668-4d98-8aea-b2fd02636611', '2025-01-02T15:50:55.765Z', '2024-04-16T00:42:19.044Z', 'Late', 'GPS malfunction', '2d8fefa5-fbcb-4566-8204-296db0f1d283', '2f7fc716-daee-4e22-a295-665b96b1f27c');
INSERT INTO "Attendance" ("id", "checkInTime", "checkOutTime", "status", "manualReason", "userId", "locationId") VALUES ('b96a4c3f-d45c-48b0-ae0f-df222218dde6', '2025-02-10T17:26:14.406Z', '2024-04-26T18:27:33.253Z', 'Absent', 'GPS malfunction', 'cc0105fd-bca3-4b84-a66b-02e697fc3424', 'c75bf3d2-3be0-4fb8-98c6-344d82c64697');
INSERT INTO "Attendance" ("id", "checkInTime", "checkOutTime", "status", "manualReason", "userId", "locationId") VALUES ('9b911e73-5150-40c2-92ce-30f1072457bb', '2024-04-07T01:14:49.835Z', '2024-10-26T18:58:35.655Z', 'Present', 'Forgot to checkin', '59dfaa73-6fe6-4df5-9fd2-15a1ef90e775', '9bfdd3b8-6513-44f1-a442-1fc6ba81e510');
INSERT INTO "Attendance" ("id", "checkInTime", "checkOutTime", "status", "manualReason", "userId", "locationId") VALUES ('87b9fbe1-541b-40fd-9885-88bc37b39162', '2025-01-17T01:34:19.731Z', '2025-09-20T08:13:34.989Z', 'Halfday', 'GPS malfunction', '24aba723-8c29-45f8-8de3-eb97984e72b6', '029b85be-1bd2-4e40-a82f-a46c766ce044');
INSERT INTO "Attendance" ("id", "checkInTime", "checkOutTime", "status", "manualReason", "userId", "locationId") VALUES ('651898f4-9aac-4582-abce-d3e863d6f354', '2025-06-17T15:55:00.918Z', '2024-03-25T10:47:46.907Z', 'Present', 'Forgot to checkin', '5045189e-1969-4fa8-b394-f2bd225cd6cd', '029b85be-1bd2-4e40-a82f-a46c766ce044');
INSERT INTO "Attendance" ("id", "checkInTime", "checkOutTime", "status", "manualReason", "userId", "locationId") VALUES ('a643610d-5b5d-4eff-9906-93bca32525cb', '2025-01-21T18:30:15.776Z', '2024-05-25T02:05:55.783Z', 'Late', 'Device battery died', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc', '1f6a870d-7ab9-4865-9ac0-0d37b9f8acad');
INSERT INTO "Attendance" ("id", "checkInTime", "checkOutTime", "status", "manualReason", "userId", "locationId") VALUES ('af81c9ff-bf03-4507-8cfd-c22bfa3720a1', '2025-09-11T17:32:19.174Z', '2024-07-29T20:56:37.470Z', 'Halfday', 'Device battery died', '59dfaa73-6fe6-4df5-9fd2-15a1ef90e775', '9bfdd3b8-6513-44f1-a442-1fc6ba81e510');
INSERT INTO "Attendance" ("id", "checkInTime", "checkOutTime", "status", "manualReason", "userId", "locationId") VALUES ('845b0f18-2dba-4b22-8609-a023384a9acd', '2025-04-09T05:53:06.456Z', '2025-08-13T10:32:07.430Z', 'Halfday', 'GPS malfunction', '5045189e-1969-4fa8-b394-f2bd225cd6cd', '2f7fc716-daee-4e22-a295-665b96b1f27c');
INSERT INTO "Attendance" ("id", "checkInTime", "checkOutTime", "status", "manualReason", "userId", "locationId") VALUES ('6e35f2d6-4791-4a10-bc35-755e25638a10', '2025-11-03T09:54:55.190Z', '2025-08-22T11:30:47.585Z', 'Halfday', 'Network issue', '24aba723-8c29-45f8-8de3-eb97984e72b6', '9bfdd3b8-6513-44f1-a442-1fc6ba81e510');
INSERT INTO "Attendance" ("id", "checkInTime", "checkOutTime", "status", "manualReason", "userId", "locationId") VALUES ('17f12489-37ee-43d0-8204-af34457f9d6e', '2025-06-20T05:54:53.910Z', '2025-07-23T07:10:07.509Z', 'Halfday', 'GPS malfunction', '24aba723-8c29-45f8-8de3-eb97984e72b6', '2f7fc716-daee-4e22-a295-665b96b1f27c');

INSERT INTO "LeaveRequest" ("id", "startDate", "endDate", "status", "documentUrl", "reason", "userId", "leaveTypeId") VALUES ('ea1514c7-d779-4ffd-84bf-430c045f79c1', '2025-10-29T10:36:43.128Z', '2024-11-21T05:31:05.521Z', 'Approved', 'https://i.imgur.com/YfJQV5z.png?id=344', 'Vacation', 'cc0105fd-bca3-4b84-a66b-02e697fc3424', '9023617f-4c0a-43d0-9cc5-4b3646d16211');
INSERT INTO "LeaveRequest" ("id", "startDate", "endDate", "status", "documentUrl", "reason", "userId", "leaveTypeId") VALUES ('cf4c0391-ced3-4f0f-9046-63e1439c0c40', '2024-05-22T18:54:02.901Z', '2025-12-06T12:46:33.247Z', 'Approved', 'https://i.imgur.com/YfJQV5z.png?id=350', 'Personal reasons', '1341297c-d920-443c-b19e-bc112d00a82c', '523e72ae-4a6b-4fb7-bb73-b1b8a0476e1f');
INSERT INTO "LeaveRequest" ("id", "startDate", "endDate", "status", "documentUrl", "reason", "userId", "leaveTypeId") VALUES ('e69e27dc-5e2a-4483-aeba-729a6c23a53b', '2024-03-29T03:51:18.334Z', '2024-12-23T14:38:23.595Z', 'Rejected', 'https://i.imgur.com/YfJQV5z.png?id=356', 'Attending a conference', '2d8fefa5-fbcb-4566-8204-296db0f1d283', '5ceadbb3-ed4e-479e-8e40-62da9c78dd2d');
INSERT INTO "LeaveRequest" ("id", "startDate", "endDate", "status", "documentUrl", "reason", "userId", "leaveTypeId") VALUES ('84169afd-30db-4561-8e40-d4070ae0c998', '2025-04-19T21:56:17.259Z', '2024-03-05T13:40:17.283Z', 'Under Review', 'https://i.imgur.com/YfJQV5z.png?id=362', 'Family emergency', '5045189e-1969-4fa8-b394-f2bd225cd6cd', 'c7cb4c91-3208-4008-a119-6b73d148f386');
INSERT INTO "LeaveRequest" ("id", "startDate", "endDate", "status", "documentUrl", "reason", "userId", "leaveTypeId") VALUES ('91d4a19c-d99f-4ba8-8467-1fd4d2fe4258', '2024-05-22T00:43:18.088Z', '2025-11-23T14:48:51.358Z', 'Pending', 'https://i.imgur.com/YfJQV5z.png?id=368', 'Vacation', '59dfaa73-6fe6-4df5-9fd2-15a1ef90e775', '2400c7c7-cbcb-44e8-b148-5bf88ccb5e67');
INSERT INTO "LeaveRequest" ("id", "startDate", "endDate", "status", "documentUrl", "reason", "userId", "leaveTypeId") VALUES ('034a864f-6867-46c9-8328-15e4bdd3f970', '2025-01-01T15:28:01.533Z', '2024-01-30T05:45:39.693Z', 'Under Review', 'https://i.imgur.com/YfJQV5z.png?id=374', 'Medical leave due to illness', '771705ee-0807-4d6f-96f6-51fc9219ac9f', '5ceadbb3-ed4e-479e-8e40-62da9c78dd2d');
INSERT INTO "LeaveRequest" ("id", "startDate", "endDate", "status", "documentUrl", "reason", "userId", "leaveTypeId") VALUES ('12105d68-95ed-425d-b18d-fb2bde514318', '2025-01-25T11:08:31.717Z', '2024-10-10T16:31:18.747Z', 'Under Review', 'https://i.imgur.com/YfJQV5z.png?id=380', 'Family emergency', '2d8fefa5-fbcb-4566-8204-296db0f1d283', 'bc356485-3dfe-45d1-b0b1-027acf35349c');
INSERT INTO "LeaveRequest" ("id", "startDate", "endDate", "status", "documentUrl", "reason", "userId", "leaveTypeId") VALUES ('1d8a0bac-a927-44e9-ba9f-fd04bb4d5136', '2024-07-13T20:07:37.200Z', '2025-05-12T21:28:18.484Z', 'Under Review', 'https://i.imgur.com/YfJQV5z.png?id=386', 'Personal reasons', '2d8fefa5-fbcb-4566-8204-296db0f1d283', '5ceadbb3-ed4e-479e-8e40-62da9c78dd2d');
INSERT INTO "LeaveRequest" ("id", "startDate", "endDate", "status", "documentUrl", "reason", "userId", "leaveTypeId") VALUES ('852194ca-1a92-4f00-9746-b587c10efbc8', '2024-07-11T01:48:54.837Z', '2024-04-21T06:17:24.420Z', 'Under Review', 'https://i.imgur.com/YfJQV5z.png?id=392', 'Personal reasons', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc', '2400c7c7-cbcb-44e8-b148-5bf88ccb5e67');
INSERT INTO "LeaveRequest" ("id", "startDate", "endDate", "status", "documentUrl", "reason", "userId", "leaveTypeId") VALUES ('16961cb5-2d4c-47ef-8a55-f71962a52c46', '2024-10-11T22:40:28.541Z', '2024-01-14T17:19:49.388Z', 'Under Review', 'https://i.imgur.com/YfJQV5z.png?id=398', 'Medical leave due to illness', '2d8fefa5-fbcb-4566-8204-296db0f1d283', 'c94882b9-583e-4fb4-9245-a83e5043a6e5');

  `

  const sqls = splitSql(sql)

  for (const sql of sqls) {
    try {
      await prisma.$executeRawUnsafe(`${sql}`)
    } catch (error) {
      console.log(`Could not insert SQL: ${error.message}`)
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async error => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
