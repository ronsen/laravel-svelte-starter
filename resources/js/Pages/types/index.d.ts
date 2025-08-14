export type Post = {
	id: number;
	title: string;
	content: string;
	content_to_html: string;
	created_at: Date;
	updated_at: Date;
};

export type User = {
	id: number;
	name: string;
	email: string;
	created_at: Date;
	updated_at: Date;
}
