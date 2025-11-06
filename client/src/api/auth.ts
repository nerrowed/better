import { pb } from "@/lib/pocketbase";
import { Collections, type LecturersResponse, type StudentsResponse, type SuperusersResponse } from "@/types/pocketbase";
import type { RecordModel } from "pocketbase";

export function isStudentRecord(record: RecordModel): boolean {
    return record.collectionName === Collections.Students;
}

export type AuthUser = (StudentsResponse | LecturersResponse) & {
    role: 'student' | 'lecturer' | 'superuser';
};


export async function login(identifier: string, password: string): Promise<AuthUser> {
    try {
        const studentAuthData = await pb.collection(Collections.Students).authWithPassword<StudentsResponse>(
            identifier, password, { identity: 'nim' }
        );
        const studentUser: AuthUser = { ...studentAuthData.record, role: 'student' };
        return studentUser;

    } catch {
        try {
            const lecturerAuthData = await pb.collection(Collections.Lecturers).authWithPassword<LecturersResponse>(
                identifier, password, { identity: 'nip' }
            );
            const lecturerUser: AuthUser = { ...lecturerAuthData.record, role: 'lecturer' };
            return lecturerUser;

        } catch {
            try {
                const superUserAuthData = await pb.collection(Collections.Superusers).authWithPassword<LecturersResponse>(
                    identifier, password
                );
                const superUser: AuthUser = { ...superUserAuthData.record, role: 'superuser' };
                return superUser;

            } catch (lecturerError) {
                console.error('Login failed for both Student and Lecturer:', lecturerError);
                throw new Error('Login failed. Please check your identifier (NIM/NIP) and password.');
            }
        }
    }
}


export function getCurrentUser(): AuthUser | null {
    if (pb.authStore.isValid && pb.authStore.record) {
        const model = pb.authStore.record;

        if (!model) return null;

        let role: AuthUser['role']
        let typedModel: StudentsResponse | LecturersResponse | SuperusersResponse

        if (model.collectionName === Collections.Students) {
            role = 'student';
            typedModel = model as StudentsResponse;
        } else if (model.collectionName === Collections.Lecturers) {
            role = 'lecturer';
            typedModel = model as LecturersResponse;
        } else if (model.collectionName === Collections.Superusers) {
            role = 'superuser';
            typedModel = model as SuperusersResponse
        } else {
            console.warn('Authenticated model does not match student or lecturer role.');
            return null;
        }

        return {
            ...typedModel,
            role: role,
        } as AuthUser;
    }
    return null;
}

export function logout(): void {
    pb.authStore.clear();
    console.log('User logged out successfully.');
}

export async function requestPasswordReset(email: string): Promise<void> {
    try {
        await pb.collection('users').requestPasswordReset(email);
    } catch (error) {
        throw new Error(String(error));
    }
}
