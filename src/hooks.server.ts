// src/hooks.server.js
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { error, redirect, type Handle } from '@sveltejs/kit';

const PROTECTED_ROUTES = ['/protected'];

function regexCreator(route: string) {
	let regexString = route;
	if (!route.includes('**')) {
		return new RegExp(regexString + '$');
	}

	regexString = regexString.replaceAll('/**', '.*');
	return new RegExp('^' + regexString);
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event,
	});

	event.locals.getSession = async () => {
		const {
			data: { session },
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	// protect requests to all routes that start with /protected-routes
	if (event.url.pathname.startsWith('/protected')) {
		const session = await event.locals.getSession();
		if (!session) {
			// the user is not signed in
			throw redirect(303, '/auth?next=' + event.url.pathname);
		}
	}

	return resolve(event);
};
