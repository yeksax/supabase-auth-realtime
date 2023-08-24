import { fail } from '@sveltejs/kit';

// src/routes/login/+page.server.ts
export const actions = {
	default: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
    
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback`,
			},
		});

		if (error) {
			console.error(error);
			return fail(500, { error: 'Server error. Try again later.', success: false, email });
		}

		return {
			message: 'Please check your email for a magic link to log into the website.',
			success: true,
		};
	},
};
