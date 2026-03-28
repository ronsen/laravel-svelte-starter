export type Post = {
    id: number;
    title: string;
    content: string;
    content_to_html: string;
    created_at: string;
    updated_at: string;
    create_url?: string;
    show_url?: string;
    edit_url?: string;
    delete_url?: string;
};

export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export type Auth = {
    user: User;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    name: string;
    auth: Auth;
    flash: string;
};
