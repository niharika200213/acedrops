PGDMP     7                    y            acedrops    14.1    14.1 ?    ?           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ?           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ?           1262    16394    acedrops    DATABASE     d   CREATE DATABASE acedrops WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_India.1252';
    DROP DATABASE acedrops;
                postgres    false            ?            1259    24841    address    TABLE     ?  CREATE TABLE public.address (
    id integer NOT NULL,
    "houseNo" character varying(255) NOT NULL,
    "streetOrPlotNo" character varying(255) NOT NULL,
    locality character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    state character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer,
    "orderId" integer
);
    DROP TABLE public.address;
       public         heap    postgres    false            ?            1259    24840    address_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.address_id_seq;
       public          postgres    false    236            ?           0    0    address_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.address_id_seq OWNED BY public.address.id;
          public          postgres    false    235            ?            1259    24712    cart    TABLE     ?   CREATE TABLE public.cart (
    id integer NOT NULL,
    price integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer
);
    DROP TABLE public.cart;
       public         heap    postgres    false            ?            1259    24711    cart_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.cart_id_seq;
       public          postgres    false    220            ?           0    0    cart_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;
          public          postgres    false    219            ?            1259    24724 	   cart_item    TABLE     ?   CREATE TABLE public.cart_item (
    id integer NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "cartId" integer,
    "productId" integer
);
    DROP TABLE public.cart_item;
       public         heap    postgres    false            ?            1259    24723    cart_item_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.cart_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.cart_item_id_seq;
       public          postgres    false    222            ?           0    0    cart_item_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.cart_item_id_seq OWNED BY public.cart_item.id;
          public          postgres    false    221            ?            1259    24743 
   categories    TABLE     ?   CREATE TABLE public.categories (
    id integer NOT NULL,
    category character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public.categories;
       public         heap    postgres    false            ?            1259    24742    categories_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.categories_id_seq;
       public          postgres    false    224            ?           0    0    categories_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;
          public          postgres    false    223            ?            1259    24750    fav    TABLE     ?   CREATE TABLE public.fav (
    id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer,
    "productId" integer
);
    DROP TABLE public.fav;
       public         heap    postgres    false            ?            1259    24749 
   fav_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.fav_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 !   DROP SEQUENCE public.fav_id_seq;
       public          postgres    false    226            ?           0    0 
   fav_id_seq    SEQUENCE OWNED BY     9   ALTER SEQUENCE public.fav_id_seq OWNED BY public.fav.id;
          public          postgres    false    225            ?            1259    24692    imgUrl    TABLE     I  CREATE TABLE public."imgUrl" (
    id integer NOT NULL,
    "imageUrl" character varying(255) DEFAULT 'default-image.jpg'::character varying,
    purpose character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "shopId" integer,
    "productId" integer
);
    DROP TABLE public."imgUrl";
       public         heap    postgres    false            ?            1259    24691    imgUrl_id_seq    SEQUENCE     ?   CREATE SEQUENCE public."imgUrl_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."imgUrl_id_seq";
       public          postgres    false    218            ?           0    0    imgUrl_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."imgUrl_id_seq" OWNED BY public."imgUrl".id;
          public          postgres    false    217            ?            1259    24769    order    TABLE     ?   CREATE TABLE public."order" (
    id integer NOT NULL,
    price integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer
);
    DROP TABLE public."order";
       public         heap    postgres    false            ?            1259    24768    order_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.order_id_seq;
       public          postgres    false    228            ?           0    0    order_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.order_id_seq OWNED BY public."order".id;
          public          postgres    false    227            ?            1259    24781 
   order_item    TABLE     ?   CREATE TABLE public.order_item (
    id integer NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "orderId" integer,
    "productId" integer
);
    DROP TABLE public.order_item;
       public         heap    postgres    false            ?            1259    24780    order_item_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.order_item_id_seq;
       public          postgres    false    230            ?           0    0    order_item_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.order_item_id_seq OWNED BY public.order_item.id;
          public          postgres    false    229            ?            1259    24648    otp    TABLE     7  CREATE TABLE public.otp (
    id integer NOT NULL,
    otp character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    purpose character varying(255) DEFAULT 'signup'::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public.otp;
       public         heap    postgres    false            ?            1259    24647 
   otp_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.otp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 !   DROP SEQUENCE public.otp_id_seq;
       public          postgres    false    214            ?           0    0 
   otp_id_seq    SEQUENCE OWNED BY     9   ALTER SEQUENCE public.otp_id_seq OWNED BY public.otp.id;
          public          postgres    false    213            ?            1259    24861    product    TABLE     T  CREATE TABLE public.product (
    id integer NOT NULL,
    stock integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    price integer NOT NULL,
    offers double precision,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "shopId" integer
);
    DROP TABLE public.product;
       public         heap    postgres    false            ?            1259    24822    product_category    TABLE     ?   CREATE TABLE public.product_category (
    id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "categoryId" integer,
    "productId" integer
);
 $   DROP TABLE public.product_category;
       public         heap    postgres    false            ?            1259    24821    product_category_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.product_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.product_category_id_seq;
       public          postgres    false    234            ?           0    0    product_category_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.product_category_id_seq OWNED BY public.product_category.id;
          public          postgres    false    233            ?            1259    24860    product_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.product_id_seq;
       public          postgres    false    238            ?           0    0    product_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;
          public          postgres    false    237            ?            1259    24800    review    TABLE       CREATE TABLE public.review (
    id integer NOT NULL,
    review text NOT NULL,
    rating integer DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer,
    "productId" integer
);
    DROP TABLE public.review;
       public         heap    postgres    false            ?            1259    24799    review_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.review_id_seq;
       public          postgres    false    232            ?           0    0    review_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.review_id_seq OWNED BY public.review.id;
          public          postgres    false    231            ?            1259    24658    shop    TABLE     i  CREATE TABLE public.shop (
    id integer NOT NULL,
    "googleId" character varying(255),
    name character varying(255) NOT NULL,
    "shopName" character varying(255),
    email character varying(255) NOT NULL,
    password character varying(255),
    dob date,
    "noOfMembers" integer,
    phno bigint,
    description text,
    address character varying(255),
    "aadhaarNo" bigint,
    "fathersName" character varying(255),
    "isVerified" boolean DEFAULT false,
    "isApplied" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public.shop;
       public         heap    postgres    false            ?            1259    24657    shop_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.shop_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.shop_id_seq;
       public          postgres    false    216            ?           0    0    shop_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.shop_id_seq OWNED BY public.shop.id;
          public          postgres    false    215            ?            1259    24639    token    TABLE     ?   CREATE TABLE public.token (
    id integer NOT NULL,
    token character varying(255),
    email character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public.token;
       public         heap    postgres    false            ?            1259    24638    token_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.token_id_seq;
       public          postgres    false    212            ?           0    0    token_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.token_id_seq OWNED BY public.token.id;
          public          postgres    false    211            ?            1259    24626    user    TABLE     P  CREATE TABLE public."user" (
    id integer NOT NULL,
    "googleId" character varying(255),
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    phno bigint,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."user";
       public         heap    postgres    false            ?            1259    24625    user_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.user_id_seq;
       public          postgres    false    210            ?           0    0    user_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;
          public          postgres    false    209            ?            1259    24875    viewed    TABLE     ?   CREATE TABLE public.viewed (
    id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer,
    "productId" integer
);
    DROP TABLE public.viewed;
       public         heap    postgres    false            ?            1259    24874    viewed_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.viewed_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.viewed_id_seq;
       public          postgres    false    240            ?           0    0    viewed_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.viewed_id_seq OWNED BY public.viewed.id;
          public          postgres    false    239            ?           2604    24844 
   address id    DEFAULT     h   ALTER TABLE ONLY public.address ALTER COLUMN id SET DEFAULT nextval('public.address_id_seq'::regclass);
 9   ALTER TABLE public.address ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    235    236    236            ?           2604    24715    cart id    DEFAULT     b   ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);
 6   ALTER TABLE public.cart ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            ?           2604    24727    cart_item id    DEFAULT     l   ALTER TABLE ONLY public.cart_item ALTER COLUMN id SET DEFAULT nextval('public.cart_item_id_seq'::regclass);
 ;   ALTER TABLE public.cart_item ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221    222            ?           2604    24746    categories id    DEFAULT     n   ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);
 <   ALTER TABLE public.categories ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    224    224            ?           2604    24753    fav id    DEFAULT     `   ALTER TABLE ONLY public.fav ALTER COLUMN id SET DEFAULT nextval('public.fav_id_seq'::regclass);
 5   ALTER TABLE public.fav ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    226    226            ?           2604    24695 	   imgUrl id    DEFAULT     j   ALTER TABLE ONLY public."imgUrl" ALTER COLUMN id SET DEFAULT nextval('public."imgUrl_id_seq"'::regclass);
 :   ALTER TABLE public."imgUrl" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            ?           2604    24772    order id    DEFAULT     f   ALTER TABLE ONLY public."order" ALTER COLUMN id SET DEFAULT nextval('public.order_id_seq'::regclass);
 9   ALTER TABLE public."order" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    228    227    228            ?           2604    24784    order_item id    DEFAULT     n   ALTER TABLE ONLY public.order_item ALTER COLUMN id SET DEFAULT nextval('public.order_item_id_seq'::regclass);
 <   ALTER TABLE public.order_item ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    229    230            ?           2604    24651    otp id    DEFAULT     `   ALTER TABLE ONLY public.otp ALTER COLUMN id SET DEFAULT nextval('public.otp_id_seq'::regclass);
 5   ALTER TABLE public.otp ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    213    214    214            ?           2604    24864 
   product id    DEFAULT     h   ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);
 9   ALTER TABLE public.product ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    238    237    238            ?           2604    24825    product_category id    DEFAULT     z   ALTER TABLE ONLY public.product_category ALTER COLUMN id SET DEFAULT nextval('public.product_category_id_seq'::regclass);
 B   ALTER TABLE public.product_category ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    234    233    234            ?           2604    24803 	   review id    DEFAULT     f   ALTER TABLE ONLY public.review ALTER COLUMN id SET DEFAULT nextval('public.review_id_seq'::regclass);
 8   ALTER TABLE public.review ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    232    231    232            ?           2604    24661    shop id    DEFAULT     b   ALTER TABLE ONLY public.shop ALTER COLUMN id SET DEFAULT nextval('public.shop_id_seq'::regclass);
 6   ALTER TABLE public.shop ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            ?           2604    24642    token id    DEFAULT     d   ALTER TABLE ONLY public.token ALTER COLUMN id SET DEFAULT nextval('public.token_id_seq'::regclass);
 7   ALTER TABLE public.token ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    211    212    212            ?           2604    24629    user id    DEFAULT     d   ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);
 8   ALTER TABLE public."user" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    209    210    210            ?           2604    24878 	   viewed id    DEFAULT     f   ALTER TABLE ONLY public.viewed ALTER COLUMN id SET DEFAULT nextval('public.viewed_id_seq'::regclass);
 8   ALTER TABLE public.viewed ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    239    240    240            ?          0    24841    address 
   TABLE DATA           ?   COPY public.address (id, "houseNo", "streetOrPlotNo", locality, city, state, "createdAt", "updatedAt", "userId", "orderId") FROM stdin;
    public          postgres    false    236   d?       ?          0    24712    cart 
   TABLE DATA           M   COPY public.cart (id, price, "createdAt", "updatedAt", "userId") FROM stdin;
    public          postgres    false    220   ??       ?          0    24724 	   cart_item 
   TABLE DATA           b   COPY public.cart_item (id, quantity, "createdAt", "updatedAt", "cartId", "productId") FROM stdin;
    public          postgres    false    222   ??       ?          0    24743 
   categories 
   TABLE DATA           L   COPY public.categories (id, category, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    224   ??       ?          0    24750    fav 
   TABLE DATA           R   COPY public.fav (id, "createdAt", "updatedAt", "userId", "productId") FROM stdin;
    public          postgres    false    226   ?       ?          0    24692    imgUrl 
   TABLE DATA           l   COPY public."imgUrl" (id, "imageUrl", purpose, "createdAt", "updatedAt", "shopId", "productId") FROM stdin;
    public          postgres    false    218   ,?       ?          0    24769    order 
   TABLE DATA           P   COPY public."order" (id, price, "createdAt", "updatedAt", "userId") FROM stdin;
    public          postgres    false    228   ¥       ?          0    24781 
   order_item 
   TABLE DATA           d   COPY public.order_item (id, quantity, "createdAt", "updatedAt", "orderId", "productId") FROM stdin;
    public          postgres    false    230   ߥ       ?          0    24648    otp 
   TABLE DATA           P   COPY public.otp (id, otp, email, purpose, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    214   ??       ?          0    24861    product 
   TABLE DATA           s   COPY public.product (id, stock, title, description, price, offers, "createdAt", "updatedAt", "shopId") FROM stdin;
    public          postgres    false    238   ?       ?          0    24822    product_category 
   TABLE DATA           c   COPY public.product_category (id, "createdAt", "updatedAt", "categoryId", "productId") FROM stdin;
    public          postgres    false    234   6?       ?          0    24800    review 
   TABLE DATA           e   COPY public.review (id, review, rating, "createdAt", "updatedAt", "userId", "productId") FROM stdin;
    public          postgres    false    232   S?       ?          0    24658    shop 
   TABLE DATA           ?   COPY public.shop (id, "googleId", name, "shopName", email, password, dob, "noOfMembers", phno, description, address, "aadhaarNo", "fathersName", "isVerified", "isApplied", "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    216   p?       ?          0    24639    token 
   TABLE DATA           K   COPY public.token (id, token, email, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    212   ??       ?          0    24626    user 
   TABLE DATA           g   COPY public."user" (id, "googleId", name, email, password, phno, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    210   ?       ?          0    24875    viewed 
   TABLE DATA           U   COPY public.viewed (id, "createdAt", "updatedAt", "userId", "productId") FROM stdin;
    public          postgres    false    240   "?       ?           0    0    address_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.address_id_seq', 1, false);
          public          postgres    false    235            ?           0    0    cart_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.cart_id_seq', 1, false);
          public          postgres    false    219            ?           0    0    cart_item_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.cart_item_id_seq', 1, false);
          public          postgres    false    221            ?           0    0    categories_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.categories_id_seq', 1, false);
          public          postgres    false    223            ?           0    0 
   fav_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.fav_id_seq', 1, false);
          public          postgres    false    225            ?           0    0    imgUrl_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."imgUrl_id_seq"', 4, true);
          public          postgres    false    217            ?           0    0    order_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.order_id_seq', 1, false);
          public          postgres    false    227            ?           0    0    order_item_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.order_item_id_seq', 1, false);
          public          postgres    false    229            ?           0    0 
   otp_id_seq    SEQUENCE SET     8   SELECT pg_catalog.setval('public.otp_id_seq', 2, true);
          public          postgres    false    213            ?           0    0    product_category_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.product_category_id_seq', 1, false);
          public          postgres    false    233            ?           0    0    product_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.product_id_seq', 1, false);
          public          postgres    false    237            ?           0    0    review_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.review_id_seq', 1, false);
          public          postgres    false    231            ?           0    0    shop_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.shop_id_seq', 2, true);
          public          postgres    false    215            ?           0    0    token_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.token_id_seq', 2, true);
          public          postgres    false    211            ?           0    0    user_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.user_id_seq', 1, false);
          public          postgres    false    209            ?           0    0    viewed_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.viewed_id_seq', 1, false);
          public          postgres    false    239            ?           2606    24848    address address_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.address DROP CONSTRAINT address_pkey;
       public            postgres    false    236            ?           2606    24731 (   cart_item cart_item_cartId_productId_key 
   CONSTRAINT     v   ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "cart_item_cartId_productId_key" UNIQUE ("cartId", "productId");
 T   ALTER TABLE ONLY public.cart_item DROP CONSTRAINT "cart_item_cartId_productId_key";
       public            postgres    false    222    222            ?           2606    24729    cart_item cart_item_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT cart_item_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.cart_item DROP CONSTRAINT cart_item_pkey;
       public            postgres    false    222            ?           2606    24717    cart cart_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_pkey;
       public            postgres    false    220            ?           2606    24748    categories categories_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    224            ?           2606    24755    fav fav_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.fav
    ADD CONSTRAINT fav_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.fav DROP CONSTRAINT fav_pkey;
       public            postgres    false    226            ?           2606    24757    fav fav_userId_productId_key 
   CONSTRAINT     j   ALTER TABLE ONLY public.fav
    ADD CONSTRAINT "fav_userId_productId_key" UNIQUE ("userId", "productId");
 H   ALTER TABLE ONLY public.fav DROP CONSTRAINT "fav_userId_productId_key";
       public            postgres    false    226    226            ?           2606    24700    imgUrl imgUrl_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."imgUrl"
    ADD CONSTRAINT "imgUrl_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."imgUrl" DROP CONSTRAINT "imgUrl_pkey";
       public            postgres    false    218            ?           2606    24788 +   order_item order_item_orderId_productId_key 
   CONSTRAINT     z   ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "order_item_orderId_productId_key" UNIQUE ("orderId", "productId");
 W   ALTER TABLE ONLY public.order_item DROP CONSTRAINT "order_item_orderId_productId_key";
       public            postgres    false    230    230            ?           2606    24786    order_item order_item_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.order_item DROP CONSTRAINT order_item_pkey;
       public            postgres    false    230            ?           2606    24774    order order_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."order" DROP CONSTRAINT order_pkey;
       public            postgres    false    228            ?           2606    24656    otp otp_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.otp
    ADD CONSTRAINT otp_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.otp DROP CONSTRAINT otp_pkey;
       public            postgres    false    214            ?           2606    24829 :   product_category product_category_categoryId_productId_key 
   CONSTRAINT     ?   ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT "product_category_categoryId_productId_key" UNIQUE ("categoryId", "productId");
 f   ALTER TABLE ONLY public.product_category DROP CONSTRAINT "product_category_categoryId_productId_key";
       public            postgres    false    234    234            ?           2606    24827 &   product_category product_category_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.product_category DROP CONSTRAINT product_category_pkey;
       public            postgres    false    234            ?           2606    24868    product product_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.product DROP CONSTRAINT product_pkey;
       public            postgres    false    238            ?           2606    24808    review review_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.review DROP CONSTRAINT review_pkey;
       public            postgres    false    232            ?           2606    24810 "   review review_userId_productId_key 
   CONSTRAINT     p   ALTER TABLE ONLY public.review
    ADD CONSTRAINT "review_userId_productId_key" UNIQUE ("userId", "productId");
 N   ALTER TABLE ONLY public.review DROP CONSTRAINT "review_userId_productId_key";
       public            postgres    false    232    232            ?           2606    24675    shop shop_aadhaarNo_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.shop
    ADD CONSTRAINT "shop_aadhaarNo_key" UNIQUE ("aadhaarNo");
 C   ALTER TABLE ONLY public.shop DROP CONSTRAINT "shop_aadhaarNo_key";
       public            postgres    false    216            ?           2606    24671    shop shop_email_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.shop
    ADD CONSTRAINT shop_email_key UNIQUE (email);
 =   ALTER TABLE ONLY public.shop DROP CONSTRAINT shop_email_key;
       public            postgres    false    216            ?           2606    24673    shop shop_phno_key 
   CONSTRAINT     M   ALTER TABLE ONLY public.shop
    ADD CONSTRAINT shop_phno_key UNIQUE (phno);
 <   ALTER TABLE ONLY public.shop DROP CONSTRAINT shop_phno_key;
       public            postgres    false    216            ?           2606    24667    shop shop_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.shop
    ADD CONSTRAINT shop_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.shop DROP CONSTRAINT shop_pkey;
       public            postgres    false    216            ?           2606    24669    shop shop_shopName_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.shop
    ADD CONSTRAINT "shop_shopName_key" UNIQUE ("shopName");
 B   ALTER TABLE ONLY public.shop DROP CONSTRAINT "shop_shopName_key";
       public            postgres    false    216            ?           2606    24646    token token_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.token DROP CONSTRAINT token_pkey;
       public            postgres    false    212            ?           2606    24635    user user_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_email_key;
       public            postgres    false    210            ?           2606    24637    user user_phno_key 
   CONSTRAINT     O   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_phno_key UNIQUE (phno);
 >   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_phno_key;
       public            postgres    false    210            ?           2606    24633    user user_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_pkey;
       public            postgres    false    210            ?           2606    24880    viewed viewed_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.viewed
    ADD CONSTRAINT viewed_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.viewed DROP CONSTRAINT viewed_pkey;
       public            postgres    false    240            ?           2606    24882 "   viewed viewed_userId_productId_key 
   CONSTRAINT     p   ALTER TABLE ONLY public.viewed
    ADD CONSTRAINT "viewed_userId_productId_key" UNIQUE ("userId", "productId");
 N   ALTER TABLE ONLY public.viewed DROP CONSTRAINT "viewed_userId_productId_key";
       public            postgres    false    240    240            ?           2606    24854    address address_orderId_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.address
    ADD CONSTRAINT "address_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 H   ALTER TABLE ONLY public.address DROP CONSTRAINT "address_orderId_fkey";
       public          postgres    false    228    3295    236            ?           2606    24849    address address_userId_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.address
    ADD CONSTRAINT "address_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 G   ALTER TABLE ONLY public.address DROP CONSTRAINT "address_userId_fkey";
       public          postgres    false    3265    236    210            ?           2606    24732    cart_item cart_item_cartId_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "cart_item_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public.cart(id) ON UPDATE CASCADE ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.cart_item DROP CONSTRAINT "cart_item_cartId_fkey";
       public          postgres    false    220    3283    222            ?           2606    24718    cart cart_userId_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 A   ALTER TABLE ONLY public.cart DROP CONSTRAINT "cart_userId_fkey";
       public          postgres    false    220    210    3265            ?           2606    24758    fav fav_userId_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.fav
    ADD CONSTRAINT "fav_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 ?   ALTER TABLE ONLY public.fav DROP CONSTRAINT "fav_userId_fkey";
       public          postgres    false    3265    226    210            ?           2606    24701    imgUrl imgUrl_shopId_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public."imgUrl"
    ADD CONSTRAINT "imgUrl_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES public.shop(id) ON UPDATE CASCADE ON DELETE SET NULL;
 G   ALTER TABLE ONLY public."imgUrl" DROP CONSTRAINT "imgUrl_shopId_fkey";
       public          postgres    false    216    218    3277            ?           2606    24789 "   order_item order_item_orderId_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.order_item DROP CONSTRAINT "order_item_orderId_fkey";
       public          postgres    false    230    3295    228            ?           2606    24775    order order_userId_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 E   ALTER TABLE ONLY public."order" DROP CONSTRAINT "order_userId_fkey";
       public          postgres    false    228    210    3265            ?           2606    24830 1   product_category product_category_categoryId_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT "product_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;
 ]   ALTER TABLE ONLY public.product_category DROP CONSTRAINT "product_category_categoryId_fkey";
       public          postgres    false    234    3289    224            ?           2606    24869    product product_shopId_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.product
    ADD CONSTRAINT "product_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES public.shop(id) ON UPDATE CASCADE ON DELETE SET NULL;
 G   ALTER TABLE ONLY public.product DROP CONSTRAINT "product_shopId_fkey";
       public          postgres    false    216    3277    238            ?           2606    24811    review review_userId_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.review
    ADD CONSTRAINT "review_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 E   ALTER TABLE ONLY public.review DROP CONSTRAINT "review_userId_fkey";
       public          postgres    false    3265    210    232            ?      x?????? ? ?      ?      x?????? ? ?      ?      x?????? ? ?      ?   D   x?3??J-O??I-??4202?54?52U02?21"=3SmS+c??\F???y%?y??????? M??      ?      x?????? ? ?      ?   ?   x???K
?0??q?
??$?gl?q?S|Z??_(?Z?8??|2D??????ҧ?ִ???ɤ|Ni0?ɑ??p?ʋnA#?rD??-(?R?|w??k?????R??p9??vՇ?S?:Q??֎P?F?      ?      x?????? ? ?      ?      x?????? ? ?      ?      x?????? ? ?      ?      x?????? ? ?      ?      x?????? ? ?      ?      x?????? ? ?      ?   '  x?}??n?@???S?୑.?RN5ְA?QҊ??
? ?"H??Mmm????d?}h磣??T9?????S??`Oi??A?N 0pYX1????¥?S?Gے.???u6?Æ???
??ӏ,?֛??/?&?
0C?@? ;q??cӼ??1??[??/????o???k???!{?9??????Z$+rK??˙??[??ٛ??z;vQ???Dm?~??r?j??m?^??"YGjSqi?}?+?&{وL?dژb?llT%"??X֢??~B}D?֧?At??K?k???3|?      ?   N  x????n?@??<E??dR]???AӤJu??/??6iM???=??ŧ???K??Ϲ??+??? ????^/o,??z?/Ȣ囕??W?????$??Nʢb?T$+?N?'?'ë????܂??5?w???˥z}NB6"?ޒ<?D ?n?˵ղϦV?2?:?A????D0???_?qs??\?]??-c^?iU ??P?C?? ???Y??=@???J???D?[bz?~?g?'????p^?~KM_!?z?"s?/??z?1???????k?ʶ#?"?jh?t3j????Y???e?5  ?o4????"?S?Y?$?????      ?      x?????? ? ?      ?      x?????? ? ?     