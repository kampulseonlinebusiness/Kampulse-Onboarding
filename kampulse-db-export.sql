--
-- PostgreSQL database dump
--

\restrict iZv767NAuewKyAotYylZFZ2v024d8y8iwiD0q52wAkLt4a6JjFgggEH21TWcbJR

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10
[]';; '
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.status_history DROP CONSTRAINT IF EXISTS status_history_application_id_applications_id_fk;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.password_reset_tokens DROP CONSTRAINT IF EXISTS password_reset_tokens_user_id_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.documents DROP CONSTRAINT IF EXISTS documents_application_id_applications_id_fk;
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS applications_job_id_jobs_id_fk;
ALTER TABLE IF EXISTS ONLY public.admin_notes DROP CONSTRAINT IF EXISTS admin_notes_application_id_applications_id_fk;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_unique;
ALTER TABLE IF EXISTS ONLY public.status_history DROP CONSTRAINT IF EXISTS status_history_pkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_token_hash_unique;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.password_reset_tokens DROP CONSTRAINT IF EXISTS password_reset_tokens_token_unique;
ALTER TABLE IF EXISTS ONLY public.password_reset_tokens DROP CONSTRAINT IF EXISTS password_reset_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.jobs DROP CONSTRAINT IF EXISTS jobs_pkey;
ALTER TABLE IF EXISTS ONLY public.documents DROP CONSTRAINT IF EXISTS documents_pkey;
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS applications_token_unique;
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS applications_pkey;
ALTER TABLE IF EXISTS ONLY public.admin_notes DROP CONSTRAINT IF EXISTS admin_notes_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.status_history ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.refresh_tokens ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.password_reset_tokens ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.jobs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.documents ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.applications ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.admin_notes ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.status_history_id_seq;
DROP TABLE IF EXISTS public.status_history;
DROP SEQUENCE IF EXISTS public.refresh_tokens_id_seq;
DROP TABLE IF EXISTS public.refresh_tokens;
DROP SEQUENCE IF EXISTS public.password_reset_tokens_id_seq;
DROP TABLE IF EXISTS public.password_reset_tokens;
DROP SEQUENCE IF EXISTS public.jobs_id_seq;
DROP TABLE IF EXISTS public.jobs;
DROP SEQUENCE IF EXISTS public.documents_id_seq;
DROP TABLE IF EXISTS public.documents;
DROP SEQUENCE IF EXISTS public.applications_id_seq;
DROP TABLE IF EXISTS public.applications;
DROP SEQUENCE IF EXISTS public.admin_notes_id_seq;
DROP TABLE IF EXISTS public.admin_notes;
DROP TYPE IF EXISTS public.user_role;
DROP TYPE IF EXISTS public.job_status;
DROP TYPE IF EXISTS public.application_status;
--
-- Name: application_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.application_status AS ENUM (
    'draft',
    'pending',
    'under_review',
    'approved',
    'rejected'
);


--
-- Name: job_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.job_status AS ENUM (
    'active',
    'closed'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'super_admin',
    'admin',
    'hr'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_notes (
    id integer NOT NULL,
    application_id integer NOT NULL,
    content text NOT NULL,
    created_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: admin_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_notes_id_seq OWNED BY public.admin_notes.id;


--
-- Name: applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    token text NOT NULL,
    job_id integer NOT NULL,
    status public.application_status DEFAULT 'draft'::public.application_status NOT NULL,
    current_step integer DEFAULT 1 NOT NULL,
    application_source text,
    expected_start_date text,
    cover_letter text,
    full_name text,
    date_of_birth text,
    gender text,
    nationality text,
    state_of_origin text,
    lga text,
    marital_status text,
    address text,
    phone text,
    email text,
    next_of_kin_name text,
    next_of_kin_relationship text,
    next_of_kin_phone text,
    next_of_kin_address text,
    emergency_contact_name text,
    emergency_contact_relationship text,
    emergency_contact_phone text,
    emergency_contact_address text,
    guarantor_full_name text,
    guarantor_address text,
    guarantor_occupation text,
    guarantor_place_of_work text,
    guarantor_phone text,
    guarantor_email text,
    guarantor_relationship text,
    guarantor_years_known integer,
    guarantor_id_type text,
    guarantor_id_number text,
    guarantor_id_issue_date text,
    guarantor_id_expiry_date text,
    witness_name text,
    witness_address text,
    witness_phone text,
    declaration_accepted boolean,
    agreed_to_terms boolean,
    full_name_confirmation text,
    signature_data text,
    agreement_signed_at timestamp with time zone,
    agreement_ip_address text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    computer_literacy text
);


--
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    application_id integer NOT NULL,
    file_type text NOT NULL,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_url text NOT NULL,
    mime_type text,
    file_size integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    title text NOT NULL,
    location text NOT NULL,
    salary text NOT NULL,
    working_hours text NOT NULL,
    transport_allowance text,
    overtime text,
    description text,
    status public.job_status DEFAULT 'active'::public.job_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    photo_url text
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: status_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.status_history (
    id integer NOT NULL,
    application_id integer NOT NULL,
    status text NOT NULL,
    note text,
    changed_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.status_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.status_history_id_seq OWNED BY public.status_history.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    password_hash text NOT NULL,
    role public.user_role DEFAULT 'hr'::public.user_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: admin_notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_notes ALTER COLUMN id SET DEFAULT nextval('public.admin_notes_id_seq'::regclass);


--
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: status_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.status_history ALTER COLUMN id SET DEFAULT nextval('public.status_history_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: admin_notes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_notes (id, application_id, content, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.applications (id, token, job_id, status, current_step, application_source, expected_start_date, cover_letter, full_name, date_of_birth, gender, nationality, state_of_origin, lga, marital_status, address, phone, email, next_of_kin_name, next_of_kin_relationship, next_of_kin_phone, next_of_kin_address, emergency_contact_name, emergency_contact_relationship, emergency_contact_phone, emergency_contact_address, guarantor_full_name, guarantor_address, guarantor_occupation, guarantor_place_of_work, guarantor_phone, guarantor_email, guarantor_relationship, guarantor_years_known, guarantor_id_type, guarantor_id_number, guarantor_id_issue_date, guarantor_id_expiry_date, witness_name, witness_address, witness_phone, declaration_accepted, agreed_to_terms, full_name_confirmation, signature_data, agreement_signed_at, agreement_ip_address, created_at, updated_at, computer_literacy) FROM stdin;
1	2118f18f-641d-417a-8e2b-d747edf5a152	1	draft	1	Referral	2002-02-06T00:00:00.000+00:00	I'm a computer operator with a 3 years bet shop cashier experience. I can work with little or no supervision. 	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-07-14 01:03:34.59693+00	2026-07-14 01:03:34.59693+00	\N
2	0fc42cc2-3191-4239-b62a-6c5ba4f74ac2	1	draft	5	Social Media	2026-08-03	I've been a Betking cashier for the last 1 year and I have the right experience to carry out this job. 	Matthew Philip 	1996-02-06	male	Nigerian	Delta State	Okpe	single	No 40 oshe road Osubi	09152718731	matthewphillips@gmail.com	Christopher Phillips 	Father	08163552327	No 40 oshe road Osubi	Mabel Phillips 	Mother 	07053461524	No 40 oshe road Osubi	Mabel Phillips 	No 40 oshe road Osubi	Civil servant	Federal High court	07083651537	mabelphillips@gmail.com	Mother	25	Voter's Card	5178265428971652	2023-10-04	2026-11-12	Raymond Tega	No 40 oshe road Osubi	08152541783	t	\N	\N	\N	\N	\N	2026-07-14 05:49:18.991016+00	2026-07-14 05:59:36.516+00	proficient
3	61d1c5ef-b048-4276-9f70-774becab22ce	1	approved	6	Job Board	2026-07-28	I've been a cahsier for the last 6 years, and I have managed three different shops are the head of operations	Anderson Links	1995-10-02	male	Nigerian	Delta State	Okpe	married	No. 2 Sakutu road Osubi	08108871638	anderson@gmail.com	Betty Links	Wife	090872162732	No. 2 Sakutu road Osubi	Betty Links	Wife	090872162732	No. 2 Sakutu road Osubi	Betty Links	No. 2 Sakutu road Osubi	Civil Servant	Nigerian Police Force	08081700217	bettylink@gmail.com	Wife	10	NIN	96386247826127867	2026-01-04	2029-07-26	Friday Tim	No. 2 Sakutu road Osubi	09087627362	t	t	Anderson Links	data:image/png;base64,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	2026-07-14 06:15:34.923+00	105.127.15.134	2026-07-14 06:09:29.798257+00	2026-07-14 06:17:34.601+00	proficient
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.documents (id, application_id, file_type, file_name, file_path, file_url, mime_type, file_size, created_at) FROM stdin;
1	2	passport	Screenshot_20260714-055957.jpg	/home/runner/workspace/artifacts/api-server/uploads/passport/2dca37b9-c3ce-4105-a00e-c30d5a45b559.jpg	/api/uploads/files/passport/2dca37b9-c3ce-4105-a00e-c30d5a45b559.jpg	image/jpeg	472640	2026-07-14 05:54:45.366671+00
2	2	cv	Screenshot_20260714-055957.jpg	/home/runner/workspace/artifacts/api-server/uploads/cv/3e5cd2cb-2e5d-49ea-9856-0b363e719181.jpg	/api/uploads/files/cv/3e5cd2cb-2e5d-49ea-9856-0b363e719181.jpg	image/jpeg	472640	2026-07-14 05:55:04.182621+00
3	2	certificate	Screenshot_20260714-055957.jpg	/home/runner/workspace/artifacts/api-server/uploads/certificates/fc6e497c-9b29-43f6-94d2-fcfef5b66e60.jpg	/api/uploads/files/certificates/fc6e497c-9b29-43f6-94d2-fcfef5b66e60.jpg	image/jpeg	472640	2026-07-14 05:55:42.735512+00
4	2	id	Screenshot_20260714-055957.jpg	/home/runner/workspace/artifacts/api-server/uploads/ids/5e95c00f-bd6d-4e52-aff2-101490516af1.jpg	/api/uploads/files/ids/5e95c00f-bd6d-4e52-aff2-101490516af1.jpg	image/jpeg	472640	2026-07-14 05:55:55.930325+00
5	2	proof_of_address	Screenshot_20260714-055957.jpg	/home/runner/workspace/artifacts/api-server/uploads/proof_of_address/ee931547-88ad-4d39-8353-41794677e426.jpg	/api/uploads/files/proof_of_address/ee931547-88ad-4d39-8353-41794677e426.jpg	image/jpeg	472640	2026-07-14 05:56:32.981271+00
6	2	guarantor_passport	Screenshot_20260714-055957.jpg	/home/runner/workspace/artifacts/api-server/uploads/guarantor/68aa4c0e-1f20-4930-acc4-a12b9cad79cb.jpg	/api/uploads/files/guarantor/68aa4c0e-1f20-4930-acc4-a12b9cad79cb.jpg	image/jpeg	472640	2026-07-14 05:58:47.505508+00
7	2	guarantor_id	Screenshot_20260714-055957.jpg	/home/runner/workspace/artifacts/api-server/uploads/guarantor/e7ed0c5b-eaf8-4709-9b00-a3757889dea2.jpg	/api/uploads/files/guarantor/e7ed0c5b-eaf8-4709-9b00-a3757889dea2.jpg	image/jpeg	472640	2026-07-14 05:58:59.741351+00
8	3	passport	Screenshot (1).png	/home/runner/workspace/artifacts/api-server/uploads/passport/4539a66d-2c17-436b-a301-2ba0ddb1d396.png	/api/uploads/files/passport/4539a66d-2c17-436b-a301-2ba0ddb1d396.png	image/png	307625	2026-07-14 06:12:21.427121+00
9	3	cv	Screenshot (1).png	/home/runner/workspace/artifacts/api-server/uploads/cv/09cddf4d-ca44-475f-9ef3-0bef59b22f37.png	/api/uploads/files/cv/09cddf4d-ca44-475f-9ef3-0bef59b22f37.png	image/png	307625	2026-07-14 06:12:26.292801+00
10	3	certificate	Screenshot (1).png	/home/runner/workspace/artifacts/api-server/uploads/certificates/4d910f96-ad7b-4739-a3dc-459ccd8c8e16.png	/api/uploads/files/certificates/4d910f96-ad7b-4739-a3dc-459ccd8c8e16.png	image/png	307625	2026-07-14 06:12:33.443548+00
11	3	id	Screenshot (1).png	/home/runner/workspace/artifacts/api-server/uploads/ids/c44f47a1-8b5c-43a1-a466-f2e3594af4a6.png	/api/uploads/files/ids/c44f47a1-8b5c-43a1-a466-f2e3594af4a6.png	image/png	307625	2026-07-14 06:12:37.677322+00
12	3	proof_of_address	Screenshot (1).png	/home/runner/workspace/artifacts/api-server/uploads/proof_of_address/4eb5c196-3ab9-4fde-88c9-b5883acd4991.png	/api/uploads/files/proof_of_address/4eb5c196-3ab9-4fde-88c9-b5883acd4991.png	image/png	307625	2026-07-14 06:12:44.031693+00
13	3	guarantor_passport	Screenshot (1).png	/home/runner/workspace/artifacts/api-server/uploads/guarantor/739b045d-5dbf-453a-a8cc-0473a69f6cce.png	/api/uploads/files/guarantor/739b045d-5dbf-453a-a8cc-0473a69f6cce.png	image/png	307625	2026-07-14 06:14:20.581363+00
14	3	guarantor_id	Screenshot (1).png	/home/runner/workspace/artifacts/api-server/uploads/guarantor/db494c86-7b7f-4338-840c-08f33e4e1475.png	/api/uploads/files/guarantor/db494c86-7b7f-4338-840c-08f33e4e1475.png	image/png	307625	2026-07-14 06:14:30.667119+00
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jobs (id, title, location, salary, working_hours, transport_allowance, overtime, description, status, created_at, updated_at, photo_url) FROM stdin;
2	BetShop Manager	Osubi, Delta State	#150,000	Mon-Sat 8am to 11pm	\N	\N	\N	active	2026-07-15 00:09:41.940908+00	2026-07-15 00:13:31.958+00	\N
1	Betshop Cashier	Osubi, Delta State	₦40,000 Monthly	Monday–Saturday, 8:00 AM – 5:00 PM	\N	\N	Responsible for cash handling, customer transactions, record keeping, and maintaining shop order at the Osubi, Delta State location.	active	2026-07-13 23:55:48.450681+00	2026-07-15 00:43:39.285+00	/api/uploads/files/job-photos/5969c209-76da-460f-b096-8b0d3f0f0ef7.png
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_reset_tokens (id, user_id, token, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.refresh_tokens (id, user_id, token_hash, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: status_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.status_history (id, application_id, status, note, changed_by, created_at) FROM stdin;
1	3	under_review	\N	Super Admin	2026-07-14 06:17:26.835671+00
2	3	approved	\N	Super Admin	2026-07-14 06:17:34.604931+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, name, password_hash, role, created_at, updated_at) FROM stdin;
1	admin@kampulse.com	Super Admin	$2b$12$pmNBvON0AEBxn70N5KPTf.S0/f6Fx9lFW5mZlyvlr.L0yQySKdVfa	super_admin	2026-07-13 23:55:48.442419+00	2026-07-13 23:55:48.442419+00
\.


--
-- Name: admin_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admin_notes_id_seq', 1, false);


--
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.applications_id_seq', 3, true);


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.documents_id_seq', 14, true);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jobs_id_seq', 2, true);


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 1, false);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 9, true);


--
-- Name: status_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.status_history_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: admin_notes admin_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_notes
    ADD CONSTRAINT admin_notes_pkey PRIMARY KEY (id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: applications applications_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_token_unique UNIQUE (token);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_token_unique UNIQUE (token);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_hash_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_hash_unique UNIQUE (token_hash);


--
-- Name: status_history status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.status_history
    ADD CONSTRAINT status_history_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: admin_notes admin_notes_application_id_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_notes
    ADD CONSTRAINT admin_notes_application_id_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.applications(id);


--
-- Name: applications applications_job_id_jobs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_job_id_jobs_id_fk FOREIGN KEY (job_id) REFERENCES public.jobs(id);


--
-- Name: documents documents_application_id_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_application_id_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.applications(id);


--
-- Name: password_reset_tokens password_reset_tokens_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: status_history status_history_application_id_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.status_history
    ADD CONSTRAINT status_history_application_id_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.applications(id);


--
-- PostgreSQL database dump complete
--

\unrestrict iZv767NAuewKyAotYylZFZ2v024d8y8iwiD0q52wAkLt4a6JjFgggEH21TWcbJR

