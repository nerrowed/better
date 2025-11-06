import type { AuthUser } from "@/api/auth";

export const ROUTES_SIDEBAR: SidebarRoutes = {
    navMain: [
        // SUPERUSER
        {
            title: "Bimbingan",
            url: "/plotting/lecturers",
            allowedRoles: ["superuser"],
            items: [
                {
                    title: "Plotting Pembimbing",
                    url: "/plotting/lecturers",
                },
                {
                    title: "Limit Bimbingan Dosen",
                    url: "/plotting/lecturers/limit",
                },
            ],
        },
        {
            title: "Sidang",
            url: "/finale-examination/schedule",
            allowedRoles: ["superuser"],
            items: [
                {
                    title: "Plotting Jadwal Sidang",
                    url: "/finale-examination/schedule",
                },
                {
                    title: "Peran Penguji",
                    url: "/finale-examination/examiner-role",
                },
                {
                    title: "Ruangan Ujian",
                    url: "/finale-examination/rooms",
                },
            ],
        },

        {
            title: "Kelola Akun",
            url: "/account/students",
            isActive: true,
            allowedRoles: ["superuser"],
            items: [
                {
                    title: "Mahasiswa",
                    url: "/account/students",
                },
                {
                    title: "Dosen",
                    url: "/account/lecturers",
                },
            ],
        },
        {
            title: "Setting",
            url: "/setting",
            allowedRoles: ["superuser"],
        },

        // VIEW SCHEDULE
        {
            title: "Jadwal Bimbingan",
            description: 'Lihat jadwal bimbingan',
            url: "/mentoring-schedule",
            allowedRoles: ["lecturer", 'student'],
        },
        {
            title: "Jadwal Sidang",
            description: 'Lihat jadwal sidang',
            url: "/finale-examination-schedule",
            allowedRoles: ["lecturer", 'student'],
        },


    ],
};

export interface SidebarSubItem {
    title: string;
    url: string;
}

export interface SidebarItem {
    title: string;
    url: string;
    isActive?: boolean;
    allowedRoles?: AuthUser['role'][];
    items?: SidebarSubItem[];
    description?: string
}

export interface SidebarRoutes {
    [key: string]: SidebarItem[];
}