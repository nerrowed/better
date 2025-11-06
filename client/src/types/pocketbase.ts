/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	FinaleExamExaminer = "finale_exam_examiner",
	FinaleExamExaminerRole = "finale_exam_examiner_role",
	FinaleExamRooms = "finale_exam_rooms",
	FinaleExamScheduleWithExaminersView = "finale_exam_schedule_with_examiners_view",
	FinaleExamSchedules = "finale_exam_schedules",
	LecturerStudentsView = "lecturer_students_view",
	Lecturers = "lecturers",
	LecturersAvailableView = "lecturers_available_view",
	MentoringSchedules = "mentoring_schedules",
	MentoringSchedulesLimitPerLecturer = "mentoring_schedules_limit_per_lecturer",
	Settings = "settings",
	Students = "students",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type FinaleExamExaminerRecord = {
	created?: IsoDateString
	id: string
	id_lecturer?: RecordIdString
	id_schedule?: RecordIdString
	role?: RecordIdString
	updated?: IsoDateString
}

export type FinaleExamExaminerRoleRecord = {
	created?: IsoDateString
	id: string
	role?: string
	updated?: IsoDateString
}

export type FinaleExamRoomsRecord = {
	created?: IsoDateString
	id: string
	room_name?: string
	updated?: IsoDateString
}

export type FinaleExamScheduleWithExaminersViewRecord<Texaminers_data = unknown> = {
	date: IsoDateString
	end_time: string
	examiners_data?: null | Texaminers_data
	id: string
	room_id: RecordIdString
	room_name?: string
	start_time: string
	student_ids: RecordIdString[]
}

export type FinaleExamSchedulesRecord = {
	created?: IsoDateString
	date: IsoDateString
	end_time: string
	id: string
	room: RecordIdString
	start_time: string
	student_ids: RecordIdString[]
	updated?: IsoDateString
}

export enum LecturerStudentsViewLecturerRoleOptions {
	"lecturer_1" = "lecturer_1",
	"lecturer_2" = "lecturer_2",
}
export type LecturerStudentsViewRecord = {
	id: string
	is_requested?: boolean
	lecturerId?: RecordIdString
	lecturerName: string
	lecturerNidn?: string
	lecturerNip: string
	lecturerRole?: LecturerStudentsViewLecturerRoleOptions
	scheduleId?: RecordIdString
	schedule_end?: IsoDateString
	schedule_start?: IsoDateString
	studentId?: RecordIdString
	studentName: string
	studentNim: string
}

export type LecturersRecord = {
	avatar?: string
	created?: IsoDateString
	email?: string
	emailVisibility?: boolean
	id: string
	name: string
	nidn?: string
	nip: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type LecturersAvailableViewRecord<TmentoredStudents = unknown> = {
	currentStudentsCount?: number
	id: string
	lecturerId?: RecordIdString
	lecturerName: string
	lecturerNip: string
	maxStudentsAllowed?: string
	mentoredStudents?: null | TmentoredStudents
}

export enum MentoringSchedulesRoleOptions {
	"lecturer_1" = "lecturer_1",
	"lecturer_2" = "lecturer_2",
}
export type MentoringSchedulesRecord = {
	created?: IsoDateString
	id: string
	is_requested?: boolean
	lecturer_id: RecordIdString
	role?: MentoringSchedulesRoleOptions
	schedule_end?: IsoDateString
	schedule_start?: IsoDateString
	student_id: RecordIdString
	updated?: IsoDateString
}

export type MentoringSchedulesLimitPerLecturerRecord = {
	created?: IsoDateString
	id: string
	lecturer: RecordIdString
	limit: number
	updated?: IsoDateString
}

export type SettingsRecord = {
	id: string
	key?: string
	value?: string
}

export type StudentsRecord = {
	avatar?: string
	created?: IsoDateString
	email?: string
	emailVisibility?: boolean
	id: string
	name: string
	nim: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type FinaleExamExaminerResponse<Texpand = unknown> = Required<FinaleExamExaminerRecord> & BaseSystemFields<Texpand>
export type FinaleExamExaminerRoleResponse<Texpand = unknown> = Required<FinaleExamExaminerRoleRecord> & BaseSystemFields<Texpand>
export type FinaleExamRoomsResponse<Texpand = unknown> = Required<FinaleExamRoomsRecord> & BaseSystemFields<Texpand>
export type FinaleExamScheduleWithExaminersViewResponse<Texaminers_data = unknown, Texpand = unknown> = Required<FinaleExamScheduleWithExaminersViewRecord<Texaminers_data>> & BaseSystemFields<Texpand>
export type FinaleExamSchedulesResponse<Texpand = unknown> = Required<FinaleExamSchedulesRecord> & BaseSystemFields<Texpand>
export type LecturerStudentsViewResponse<Texpand = unknown> = Required<LecturerStudentsViewRecord> & BaseSystemFields<Texpand>
export type LecturersResponse<Texpand = unknown> = Required<LecturersRecord> & AuthSystemFields<Texpand>
export type LecturersAvailableViewResponse<TmentoredStudents = unknown, Texpand = unknown> = Required<LecturersAvailableViewRecord<TmentoredStudents>> & BaseSystemFields<Texpand>
export type MentoringSchedulesResponse<Texpand = unknown> = Required<MentoringSchedulesRecord> & BaseSystemFields<Texpand>
export type MentoringSchedulesLimitPerLecturerResponse<Texpand = unknown> = Required<MentoringSchedulesLimitPerLecturerRecord> & BaseSystemFields<Texpand>
export type SettingsResponse<Texpand = unknown> = Required<SettingsRecord> & BaseSystemFields<Texpand>
export type StudentsResponse<Texpand = unknown> = Required<StudentsRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	finale_exam_examiner: FinaleExamExaminerRecord
	finale_exam_examiner_role: FinaleExamExaminerRoleRecord
	finale_exam_rooms: FinaleExamRoomsRecord
	finale_exam_schedule_with_examiners_view: FinaleExamScheduleWithExaminersViewRecord
	finale_exam_schedules: FinaleExamSchedulesRecord
	lecturer_students_view: LecturerStudentsViewRecord
	lecturers: LecturersRecord
	lecturers_available_view: LecturersAvailableViewRecord
	mentoring_schedules: MentoringSchedulesRecord
	mentoring_schedules_limit_per_lecturer: MentoringSchedulesLimitPerLecturerRecord
	settings: SettingsRecord
	students: StudentsRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	finale_exam_examiner: FinaleExamExaminerResponse
	finale_exam_examiner_role: FinaleExamExaminerRoleResponse
	finale_exam_rooms: FinaleExamRoomsResponse
	finale_exam_schedule_with_examiners_view: FinaleExamScheduleWithExaminersViewResponse
	finale_exam_schedules: FinaleExamSchedulesResponse
	lecturer_students_view: LecturerStudentsViewResponse
	lecturers: LecturersResponse
	lecturers_available_view: LecturersAvailableViewResponse
	mentoring_schedules: MentoringSchedulesResponse
	mentoring_schedules_limit_per_lecturer: MentoringSchedulesLimitPerLecturerResponse
	settings: SettingsResponse
	students: StudentsResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'finale_exam_examiner'): RecordService<FinaleExamExaminerResponse>
	collection(idOrName: 'finale_exam_examiner_role'): RecordService<FinaleExamExaminerRoleResponse>
	collection(idOrName: 'finale_exam_rooms'): RecordService<FinaleExamRoomsResponse>
	collection(idOrName: 'finale_exam_schedule_with_examiners_view'): RecordService<FinaleExamScheduleWithExaminersViewResponse>
	collection(idOrName: 'finale_exam_schedules'): RecordService<FinaleExamSchedulesResponse>
	collection(idOrName: 'lecturer_students_view'): RecordService<LecturerStudentsViewResponse>
	collection(idOrName: 'lecturers'): RecordService<LecturersResponse>
	collection(idOrName: 'lecturers_available_view'): RecordService<LecturersAvailableViewResponse>
	collection(idOrName: 'mentoring_schedules'): RecordService<MentoringSchedulesResponse>
	collection(idOrName: 'mentoring_schedules_limit_per_lecturer'): RecordService<MentoringSchedulesLimitPerLecturerResponse>
	collection(idOrName: 'settings'): RecordService<SettingsResponse>
	collection(idOrName: 'students'): RecordService<StudentsResponse>
}
