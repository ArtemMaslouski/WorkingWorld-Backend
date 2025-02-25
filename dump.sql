--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Debian 16.6-1.pgdg120+1)
-- Dumped by pg_dump version 16.2

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: workingworld_d307_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO workingworld_d307_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: workingworld_d307_user
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: User; Type: TABLE; Schema: public; Owner: workingworld_d307_user
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    "Password" text NOT NULL,
    "UserName" text NOT NULL,
    "Email" text NOT NULL,
    "ResetCode" text,
    "ResetCodeExpires" timestamp(3) without time zone
);


ALTER TABLE public."User" OWNER TO workingworld_d307_user;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: workingworld_d307_user
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO workingworld_d307_user;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: workingworld_d307_user
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: workingworld_d307_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO workingworld_d307_user;

--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: workingworld_d307_user
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: workingworld_d307_user
--

COPY public."User" (id, "Password", "UserName", "Email", "ResetCode", "ResetCodeExpires") FROM stdin;
2	$2b$10$nzx/SR9SAxa8jKKJXpj2z.y/RlMuxeI3PbdDN2TrJjqij6rry7HnG	Artsiom	masloartem0410@gmail.com	\N	\N
3	$2b$10$jF6blnLOEv0Pjh.HPoOLGeUg3jGuOz0nD0W1PWbtZMF/zIh371fdm	Бондарь Юлия	uliabondar359@gmail.com	\N	\N
1	$2b$10$g3rKWiXUK2O.8qKlanCmIOICGFXk6Q4WuSQmys8AH1CqSjA7SxE0q	Artsiom	masloartem0310@gmail.com	\N	\N
70	$2b$10$4yqMG020oIzAmzFBi1Km7eJhiaa/fnoVFF2FnDbeFv8g69yx2RE3K	Artsiom2003	masloartem20@gmail.com	\N	\N
65	$2b$10$pQvbJ1gSdq.0N8nnh3ehg.fzgem.E/mxJifHSrodSr7MfTPcBhf6O	Artsiom123	artsiom123@gmail.com	\N	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: workingworld_d307_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
fc8fb252-f3c0-4e32-b993-a770ecc89cef	cd7a5e1b642d2b61f8e6c3ad6088c4c4b12a2ade4e35f65ebfa3de81b9b8dbf1	2025-02-15 18:26:30.370673+00	20250121173430_init	\N	\N	2025-02-15 18:26:29.97021+00	1
73440f5c-80ad-41fd-9b3a-274c3e9c677e	02127f5ef182bdf9082f5c8268c5e1e670abe3c53348a343e23ddb0f1af1d4a6	2025-02-15 18:26:31.093076+00	20250128183654_add_reset_token_fields	\N	\N	2025-02-15 18:26:30.626656+00	1
afb3401d-d0fb-4fec-9d24-1054fa7a1c0d	42b435e1341363ec22dc499f040692d37942f9e6fff256366b5be73f7ad4c56b	2025-02-15 18:26:31.768231+00	20250129165033_add_telephone_number	\N	\N	2025-02-15 18:26:31.17631+00	1
27aa0487-f0d1-4b87-9356-a51b5cfa1763	ef6e39b7da4e0bd21ff4dc3db1132af60c0fc029276a02660dd0c3ab82c3cbac	2025-02-15 18:26:33.1255+00	20250129165451_add_user_name	\N	\N	2025-02-15 18:26:32.19046+00	1
07dc553d-f909-4307-a2f2-10d2f34d70e0	d40fad8da5ee23cce4c2d12556e4b1061fd930609741ed8077d4ddf6bd4e6a02	2025-02-15 18:26:34.188444+00	20250130132615_change_telephone_number_with_email	\N	\N	2025-02-15 18:26:33.342193+00	1
0bddd14b-6b66-4b67-80d8-b7ab1d5ee0bb	b01a2c7b40dcf42b31a85a7054a05977dc17ce5565b8ce7cad45c8ceacf65054	2025-02-15 18:26:35.422852+00	20250130141905_change_name_of_columns_in_table	\N	\N	2025-02-15 18:26:34.5307+00	1
c71ba951-f1b4-4409-a2d2-05a831cdc59d	95b58e454f093ff2a6230e695f7b6e43cf86a18d49d61b8aca8d3f3da517a7bf	2025-02-15 18:26:36.060489+00	20250201133751_add_email_to_user	\N	\N	2025-02-15 18:26:35.730192+00	1
f45f3163-e4ec-4cda-88cc-3d0026e2b449	780c093d0c4bbadbd596f986b2ee7399688a1b5bcff363c892aef57a2b997cb4	2025-02-15 18:28:59.212199+00	20250215182857_delete_unique_for_user_name	\N	\N	2025-02-15 18:28:58.274566+00	1
\.


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: workingworld_d307_user
--

SELECT pg_catalog.setval('public."User_id_seq"', 70, true);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: workingworld_d307_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: workingworld_d307_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_Email_key; Type: INDEX; Schema: public; Owner: workingworld_d307_user
--

CREATE UNIQUE INDEX "User_Email_key" ON public."User" USING btree ("Email");


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: workingworld_d307_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO workingworld_d307_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO workingworld_d307_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO workingworld_d307_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO workingworld_d307_user;


--
-- PostgreSQL database dump complete
--

