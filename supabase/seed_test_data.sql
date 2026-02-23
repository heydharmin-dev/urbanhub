-- ============================================================
-- SEED DATA: 50 Restaurants + 50 Chefs with diverse attributes
-- Run this in the Supabase SQL Editor as postgres role
-- ============================================================

-- First, update the role constraint to include restaurant (already done via migration 009)
-- This script assumes migrations 001-013 have been run.

-- ============================================================
-- PART 1: CREATE 50 RESTAURANT USERS
-- ============================================================
-- We use gen_random_uuid() for IDs and insert into auth.users + profiles + restaurant_profiles

DO $$
DECLARE
  user_ids uuid[] := ARRAY[]::uuid[];
  uid uuid;
  i integer;

  -- Restaurant data arrays
  names text[] := ARRAY[
    'Spice Garden', 'The Italian Table', 'Dragon Palace', 'Sakura Sushi', 'Taco Fiesta',
    'Le Petit Bistro', 'Bangkok Bites', 'Mediterranean Breeze', 'The American Grill', 'Seoul Kitchen',
    'Masala House', 'Pasta Paradise', 'Golden Wok', 'Tokyo Ramen', 'Burrito Brothers',
    'Cafe de Paris', 'Thai Orchid', 'Olive & Vine', 'Smokehouse BBQ', 'Kimchi Corner',
    'Taj Mahal Kitchen', 'Trattoria Roma', 'Dim Sum Delight', 'Sashimi Station', 'Casa Mexico',
    'Croissant & Co', 'Pad Thai Express', 'Santorini Grill', 'Burger Republic', 'Bibimbap Bowl',
    'Curry Leaf', 'Pizza Napoli', 'Wonton World', 'Tempura House', 'El Sombrero',
    'Patisserie Lyon', 'Mango Tree', 'Aegean Table', 'Steakhouse Prime', 'Gangnam Kitchen',
    'Biryani Pot', 'Gelato Dreams', 'Noodle Bar', 'Udon Master', 'Cantina Del Sol',
    'Boulangerie Bliss', 'Coconut Curry', 'Blue Aegean', 'Flame Grill House', 'Hanbok Dining'
  ];

  types text[] := ARRAY[
    'restaurant', 'restaurant', 'restaurant', 'restaurant', 'restaurant',
    'cafe', 'restaurant', 'restaurant', 'restaurant', 'restaurant',
    'restaurant', 'restaurant', 'restaurant', 'restaurant', 'restaurant',
    'cafe', 'restaurant', 'cafe', 'restaurant', 'restaurant',
    'hotel', 'restaurant', 'restaurant', 'restaurant', 'restaurant',
    'cafe', 'restaurant', 'restaurant', 'restaurant', 'restaurant',
    'catering', 'restaurant', 'restaurant', 'restaurant', 'restaurant',
    'cafe', 'restaurant', 'restaurant', 'restaurant', 'restaurant',
    'cloud_kitchen', 'cafe', 'restaurant', 'restaurant', 'restaurant',
    'cafe', 'cloud_kitchen', 'restaurant', 'restaurant', 'hotel'
  ];

  cities text[] := ARRAY[
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad',
    'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Lucknow',
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad',
    'Pune', 'Kolkata', 'Goa', 'Chandigarh', 'Kochi',
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad',
    'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Indore',
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad',
    'Pune', 'Kolkata', 'Goa', 'Chandigarh', 'Kochi',
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Surat',
    'Nagpur', 'Vadodara', 'Mysore', 'Coimbatore', 'Visakhapatnam'
  ];

  contacts text[] := ARRAY[
    'Rajesh Kumar', 'Marco Rossi', 'Wei Chen', 'Yuki Tanaka', 'Carlos Garcia',
    'Pierre Dupont', 'Somchai Patel', 'Nikos Papadopoulos', 'John Smith', 'Min-Jun Park',
    'Priya Sharma', 'Luigi Bianchi', 'Li Wei', 'Haruki Mori', 'Maria Lopez',
    'Jean Laurent', 'Arun Thakur', 'Elena Costa', 'James Wilson', 'Soo-Yeon Kim',
    'Vikram Malhotra', 'Antonio Ferrari', 'Zhang Wei', 'Kenji Suzuki', 'Diego Rivera',
    'Sophie Martin', 'Niran Chandra', 'Dimos Alexis', 'Mike Johnson', 'Ji-Hye Lee',
    'Deepak Verma', 'Francesca Ricci', 'Ming Li', 'Akira Yamamoto', 'Fernando Mendez',
    'Claire Beaumont', 'Arjun Nair', 'Stavros Georgiou', 'Robert Davis', 'Hyun-Woo Choi',
    'Anand Patel', 'Maria Greco', 'Liang Chen', 'Takeshi Ito', 'Rosa Hernandez',
    'Isabelle Moreau', 'Suresh Menon', 'Petros Nikolaou', 'David Brown', 'Eun-Ji Kang'
  ];

  descriptions text[] := ARRAY[
    'Authentic Indian spices and traditional recipes passed down through generations',
    'Classic Italian cuisine with handmade pasta and wood-fired pizzas',
    'Traditional Cantonese and Szechuan dishes in an elegant setting',
    'Fresh sushi and Japanese cuisine prepared by master chefs',
    'Vibrant Mexican flavors with handmade tortillas and fresh salsas',
    'French-inspired cafe with artisan pastries and gourmet coffee',
    'Authentic Thai street food flavors in a modern dining experience',
    'Fresh Mediterranean dishes with olive oil and seasonal produce',
    'Premium steaks, burgers, and classic American comfort food',
    'Authentic Korean BBQ and traditional dishes with modern twist',
    'North Indian cuisine with tandoor specialties and rich curries',
    'Fresh pasta made daily with imported Italian ingredients',
    'Dim sum and wok-fried specialties from across China',
    'Hand-pulled ramen noodles and authentic Japanese broths',
    'Tex-Mex favorites with a gourmet twist and craft margaritas',
    'Elegant French patisserie with seasonal tasting menus',
    'Royal Thai cuisine with organic ingredients and fresh herbs',
    'Farm-to-table Mediterranean with extensive wine selection',
    'Slow-smoked meats and classic BBQ sides with craft beers',
    'Modern Korean fusion with traditional fermented flavors',
    'Mughlai and Awadhi cuisine fit for royalty',
    'Neapolitan-style pizzas with DOP certified ingredients',
    'Handcrafted dim sum and Cantonese roast specialties',
    'Premium sashimi and omakase dining experience',
    'Authentic regional Mexican cuisine from Oaxaca and Puebla',
    'Artisanal French baked goods and brunch favorites',
    'Traditional pad thai and curry dishes with organic produce',
    'Greek-inspired dishes with fresh seafood and olive oil',
    'Craft burgers with locally sourced beef and artisan buns',
    'Korean rice bowls and banchan with house-made sauces',
    'South Indian curries and dosas with authentic spice blends',
    'Wood-fired Neapolitan pizzas and Italian street food',
    'Wonton soups and noodle dishes from across Asia',
    'Crispy tempura and traditional Japanese izakaya dishes',
    'Festive Mexican cantina with live music and craft cocktails',
    'French pastries, bread, and seasonal desserts',
    'Southeast Asian curries and grilled specialties',
    'Aegean coast flavors with fresh fish and mezes',
    'Premium cuts grilled over open flame with signature rubs',
    'Modern Korean gastropub with soju cocktails',
    'Hyderabadi dum biryani and Nizami cuisine',
    'Artisan gelato and Italian desserts made fresh daily',
    'Pan-Asian noodle bar with customizable bowls',
    'Hand-pulled udon noodles and Japanese comfort food',
    'Sunlit cantina with tacos, ceviche, and tequila flights',
    'Rustic French bakery with sourdough and viennoiseries',
    'Coconut-based curries and South Indian coastal cuisine',
    'Greek island cuisine with rooftop dining and sea views',
    'Charcoal-grilled meats with house-made chimichurri',
    'Traditional Korean dining with hanbok-inspired decor'
  ];

BEGIN
  FOR i IN 1..50 LOOP
    uid := gen_random_uuid();
    user_ids := array_append(user_ids, uid);

    -- Insert into auth.users
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, role, aud, confirmation_token
    ) VALUES (
      uid,
      '00000000-0000-0000-0000-000000000000',
      'restaurant' || i || '@chefhire.com',
      crypt('Test@12345', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', contacts[i], 'phone', '+91' || (9000000000 + i)::text, 'role', 'restaurant'),
      now() - (random() * interval '90 days'),
      now(),
      'authenticated',
      'authenticated',
      ''
    );

    -- Insert into auth.identities
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (
      uid, uid,
      jsonb_build_object('sub', uid::text, 'email', 'restaurant' || i || '@chefhire.com'),
      'email', uid::text, now(), now(), now()
    );

    -- Insert into profiles
    INSERT INTO public.profiles (id, full_name, email, phone, role)
    VALUES (
      uid,
      contacts[i],
      'restaurant' || i || '@chefhire.com',
      '+91' || (9000000000 + i)::text,
      'restaurant'
    );

    -- Insert into restaurant_profiles
    INSERT INTO public.restaurant_profiles (
      user_id, business_name, business_type, address, city,
      contact_person, contact_phone, website, description
    ) VALUES (
      uid,
      names[i],
      types[i],
      (100 + i)::text || ' ' || CASE
        WHEN i % 5 = 0 THEN 'MG Road'
        WHEN i % 5 = 1 THEN 'Park Street'
        WHEN i % 5 = 2 THEN 'Brigade Road'
        WHEN i % 5 = 3 THEN 'Marine Drive'
        ELSE 'Jubilee Hills'
      END,
      cities[i],
      contacts[i],
      '+91' || (9000000000 + i)::text,
      CASE WHEN i % 3 = 0 THEN 'https://www.' || lower(replace(names[i], ' ', '')) || '.com' ELSE NULL END,
      descriptions[i]
    );

  END LOOP;

  RAISE NOTICE '✅ Created 50 restaurant users + profiles + restaurant_profiles';
END $$;


-- ============================================================
-- PART 2: CREATE 50 CHEF USERS
-- ============================================================

DO $$
DECLARE
  user_ids uuid[] := ARRAY[]::uuid[];
  uid uuid;
  i integer;

  -- Chef data arrays
  chef_names text[] := ARRAY[
    'Aman Gupta', 'Ravi Shankar', 'Sanjay Deshmukh', 'Kiran Reddy', 'Arjun Singh',
    'Neha Kapoor', 'Pooja Iyer', 'Sunil Yadav', 'Manish Tiwari', 'Rohit Joshi',
    'Divya Nair', 'Amit Pandey', 'Kavita Rao', 'Rahul Mehta', 'Sneha Kulkarni',
    'Vijay Patil', 'Anita Choudhury', 'Manoj Saxena', 'Ritu Agarwal', 'Prakash Shetty',
    'Lakshmi Menon', 'Gaurav Mishra', 'Swati Jain', 'Nikhil Bhatt', 'Priyanka Das',
    'Siddharth Hegde', 'Meera Pillai', 'Ashok Rathore', 'Sunita Bose', 'Rajiv Khanna',
    'Deepa Chandra', 'Anil Kumar', 'Nandini Prasad', 'Harish Gowda', 'Fatima Khan',
    'Saurabh Dubey', 'Tara Krishnan', 'Pankaj Mohan', 'Geeta Srinivasan', 'Vishal Thakur',
    'Uma Devi', 'Santosh Pawar', 'Rekha Mahajan', 'Naveen Joseph', 'Bhavna Shah',
    'Girish Naik', 'Padma Rao', 'Dinesh Sharma', 'Anjali Banerjee', 'Mukesh Patel'
  ];

  specialties text[] := ARRAY[
    'Indian, Italian, Chinese', 'Indian, Thai', 'Indian, Mexican', 'Indian, Japanese, Korean', 'Indian, French',
    'Italian, French, Mediterranean', 'Indian, Thai, Chinese', 'Indian', 'Indian, Italian', 'Chinese, Japanese',
    'Indian, Mediterranean', 'Indian, Chinese', 'Indian, Italian, Thai', 'Italian, French', 'Indian, Japanese',
    'Indian, Mexican, American', 'Indian, Thai, Mediterranean', 'French, Italian', 'Indian, Chinese, Korean', 'Indian, Mediterranean',
    'Indian', 'Indian, Italian, Chinese', 'Indian, French', 'Chinese, Japanese, Korean', 'Indian, Thai',
    'Italian, Mediterranean', 'Indian, Chinese', 'Indian, American', 'Indian, French, Italian', 'Indian, Thai, Japanese',
    'Indian, Chinese, Thai', 'Indian, Italian', 'Indian, Japanese', 'Indian, Korean', 'Indian, Middle Eastern',
    'French, Italian, Mediterranean', 'Indian, Thai', 'Indian, Chinese, Japanese', 'Indian, Italian', 'Indian, American, Mexican',
    'Indian', 'Indian, Chinese', 'Indian, Italian, French', 'Indian, Korean, Japanese', 'Indian, Mediterranean',
    'Indian, Thai, Chinese', 'Indian, Italian', 'Indian, Chinese', 'Indian, French, Italian', 'Indian, American'
  ];

  locations text[] := ARRAY[
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad',
    'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Lucknow',
    'Kochi', 'Indore', 'Goa', 'Chandigarh', 'Mysore',
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad',
    'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Surat',
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad',
    'Pune', 'Kolkata', 'Goa', 'Chandigarh', 'Lucknow',
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad',
    'Pune', 'Kolkata', 'Jaipur', 'Kochi', 'Nagpur',
    'Mumbai', 'Delhi', 'Bangalore', 'Coimbatore', 'Vadodara'
  ];

  bios text[] := ARRAY[
    'Passionate chef with expertise in North Indian cuisine and Italian fusion. Trained at IHM Mumbai.',
    'Classical Indian cooking with a modern twist. Specialized in tandoor and live counters.',
    'Versatile chef experienced in multi-cuisine catering for events up to 500 guests.',
    'Sushi master trained in Tokyo for 3 years. Expert in Japanese and Korean cuisine.',
    'French-trained pastry chef and head chef with Michelin-star restaurant experience.',
    'Specializes in Italian and French cuisine. Le Cordon Bleu certified.',
    'Expert in Thai and Asian fusion cuisine with 10+ years in 5-star hotels.',
    'Home-style Indian cooking specialist. Known for authentic regional recipes.',
    'Italian cuisine expert with pasta-making certification from Bologna, Italy.',
    'Chinese and Japanese cuisine specialist with wok skills and dim sum expertise.',
    'Kerala cuisine expert with deep knowledge of Ayurvedic cooking principles.',
    'Pan-Asian specialist with experience in fine dining and casual restaurants.',
    'Multi-cuisine chef with award-winning biryani and kebab preparations.',
    'Fine dining expert trained in classical French and Italian techniques.',
    'Japanese cuisine specialist with knife skills certification from Japan.',
    'American BBQ and Mexican cuisine expert with food truck experience.',
    'Thai and Mediterranean fusion chef with organic cooking philosophy.',
    'Classical French chef with pastry and dessert specialization.',
    'Indo-Chinese fusion expert with popular street food concepts.',
    'Mediterranean and coastal Indian cuisine specialist.',
    'Traditional South Indian chef with 25 years of experience in temple kitchens and hotels.',
    'Young innovative chef combining Indian flavors with international techniques.',
    'French pastry and bread artisan with sourdough specialization.',
    'Pan-Asian expert specializing in ramen, dim sum, and Korean BBQ.',
    'Bengali cuisine specialist known for fish preparations and sweets.',
    'Coastal Italian expert with focus on seafood and Mediterranean diet.',
    'Chettinad and Kerala cuisine specialist with knowledge of 50+ curries.',
    'American comfort food and BBQ pitmaster with competition wins.',
    'Multi-cuisine expert with hotel management degree and 15 years experience.',
    'Japanese izakaya style chef with expertise in grilling and fermentation.',
    'Street food specialist covering Indian, Thai, and Mexican cuisines.',
    'North Indian curry master with experience in London Indian restaurants.',
    'Sushi and sashimi expert with omakase dining experience.',
    'Korean cuisine specialist with expertise in fermentation and banchan.',
    'Middle Eastern and Indian Mughlai cuisine expert.',
    'Classical French and Italian chef with wine pairing expertise.',
    'Thai curry and dessert specialist with culinary school diploma.',
    'Chinese regional cuisine expert covering Cantonese, Szechuan, and Hunan.',
    'Italian pizza and pasta master with wood-fired oven expertise.',
    'American and Mexican grill master with farm-to-table philosophy.',
    'Temple cuisine and Sattvic cooking expert with deep spiritual approach.',
    'Maharashtrian and Goan cuisine specialist with coastal seafood focus.',
    'Multi-cuisine banquet chef with experience managing teams of 20+.',
    'Japanese and Korean fusion chef with molecular gastronomy skills.',
    'Gujarati and Rajasthani vegetarian cuisine specialist.',
    'Pan-Asian noodle and soup expert with handmade noodle skills.',
    'Italian chef with 3 years training in Rome and Naples.',
    'Indo-Chinese and Manchurian cuisine pioneer with 20+ years experience.',
    'French and Italian fine dining chef with sommelier certification.',
    'All-rounder chef comfortable with Indian, Chinese, and Continental.'
  ];

  exp_years integer[] := ARRAY[
    8, 12, 6, 15, 20,
    10, 14, 5, 9, 11,
    7, 13, 3, 18, 6,
    4, 16, 22, 8, 10,
    25, 3, 12, 7, 9,
    11, 15, 6, 17, 8,
    4, 10, 5, 13, 19,
    21, 9, 14, 7, 11,
    30, 8, 16, 6, 12,
    10, 15, 20, 18, 5
  ];

  hourly_rates numeric[] := ARRAY[
    800, 1200, 600, 1500, 2000,
    1000, 1400, 500, 900, 1100,
    700, 1300, 400, 1800, 650,
    450, 1600, 2200, 850, 1050,
    2500, 350, 1250, 750, 950,
    1150, 1550, 600, 1700, 800,
    400, 1000, 500, 1350, 1900,
    2100, 900, 1450, 700, 1100,
    3000, 800, 1650, 550, 1200,
    1050, 1500, 2000, 1850, 500
  ];

  daily_rates numeric[] := ARRAY[
    5000, 8000, 4000, 10000, 15000,
    7000, 9000, 3500, 6000, 7500,
    4500, 8500, 2500, 12000, 4200,
    3000, 10500, 16000, 5500, 7000,
    18000, 2200, 8200, 5000, 6500,
    7800, 10000, 4000, 11000, 5200,
    2800, 6500, 3500, 9000, 13000,
    14000, 6000, 9500, 4500, 7200,
    20000, 5500, 11000, 3800, 8000,
    7000, 10000, 13500, 12500, 3500
  ];

  verification_statuses text[] := ARRAY[
    'approved', 'approved', 'approved', 'approved', 'approved',
    'approved', 'approved', 'approved', 'approved', 'approved',
    'approved', 'approved', 'pending', 'approved', 'approved',
    'pending', 'approved', 'approved', 'approved', 'approved',
    'approved', 'pending', 'approved', 'approved', 'approved',
    'approved', 'approved', 'pending', 'approved', 'approved',
    'rejected', 'approved', 'approved', 'approved', 'approved',
    'approved', 'approved', 'approved', 'pending', 'approved',
    'approved', 'approved', 'approved', 'approved', 'approved',
    'approved', 'pending', 'approved', 'approved', 'approved'
  ];

BEGIN
  FOR i IN 1..50 LOOP
    uid := gen_random_uuid();
    user_ids := array_append(user_ids, uid);

    -- Insert into auth.users
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, role, aud, confirmation_token
    ) VALUES (
      uid,
      '00000000-0000-0000-0000-000000000000',
      'chef' || i || '@chefhire.com',
      crypt('Test@12345', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', chef_names[i], 'phone', '+91' || (8000000000 + i)::text, 'role', 'chef'),
      now() - (random() * interval '120 days'),
      now(),
      'authenticated',
      'authenticated',
      ''
    );

    -- Insert into auth.identities
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (
      uid, uid,
      jsonb_build_object('sub', uid::text, 'email', 'chef' || i || '@chefhire.com'),
      'email', uid::text, now(), now(), now()
    );

    -- Insert into profiles
    INSERT INTO public.profiles (id, full_name, email, phone, role)
    VALUES (
      uid,
      chef_names[i],
      'chef' || i || '@chefhire.com',
      '+91' || (8000000000 + i)::text,
      'chef'
    );

    -- Insert into chef_profiles
    INSERT INTO public.chef_profiles (
      user_id, experience_years, specialty, location,
      price_per_hour, price_per_day, bio,
      verification_status, avg_rating, total_reviews
    ) VALUES (
      uid,
      exp_years[i],
      specialties[i],
      locations[i],
      hourly_rates[i],
      daily_rates[i],
      bios[i],
      verification_statuses[i],
      CASE
        WHEN verification_statuses[i] = 'approved' THEN round((3.5 + random() * 1.5)::numeric, 2)
        ELSE 0
      END,
      CASE
        WHEN verification_statuses[i] = 'approved' THEN floor(random() * 50 + 1)::integer
        ELSE 0
      END
    );

  END LOOP;

  RAISE NOTICE '✅ Created 50 chef users + profiles + chef_profiles';
END $$;


-- ============================================================
-- PART 3: CREATE SAMPLE JOBS (20 jobs from various restaurants)
-- ============================================================

DO $$
DECLARE
  rest_ids uuid[];
  rid uuid;
  i integer;

  job_titles text[] := ARRAY[
    'Head Chef for Italian Kitchen',
    'Tandoor Chef - Full Time',
    'Sushi Chef Needed Urgently',
    'Pastry Chef for Cafe',
    'Chinese Wok Expert',
    'Banquet Chef for Wedding Season',
    'Sous Chef - Fine Dining',
    'Pizza Chef - Wood Fired Oven',
    'Indian Curry Specialist',
    'Thai Cuisine Expert for New Branch',
    'Breakfast Chef - Hotel',
    'BBQ Pitmaster for New Restaurant',
    'Korean BBQ Chef Needed',
    'Multi-Cuisine Chef for Cloud Kitchen',
    'Dessert Chef - Part Time',
    'Live Counter Chef for Events',
    'Ramen Chef with Experience',
    'Mediterranean Cuisine Chef',
    'South Indian Chef for Chain',
    'Continental Chef for Club'
  ];

  cuisines text[] := ARRAY[
    'Italian', 'Indian', 'Japanese', 'French', 'Chinese',
    'Indian', 'French', 'Italian', 'Indian', 'Thai',
    'Indian', 'American', 'Korean', 'Indian', 'French',
    'Indian', 'Japanese', 'Mediterranean', 'Indian', 'Italian'
  ];

  sal_amounts numeric[] := ARRAY[
    45000, 35000, 55000, 40000, 38000,
    50000, 60000, 32000, 30000, 42000,
    28000, 48000, 45000, 35000, 20000,
    25000, 50000, 42000, 30000, 55000
  ];

  sal_types text[] := ARRAY[
    'monthly', 'monthly', 'monthly', 'monthly', 'monthly',
    'fixed', 'monthly', 'monthly', 'monthly', 'monthly',
    'monthly', 'monthly', 'monthly', 'monthly', 'hourly',
    'fixed', 'monthly', 'monthly', 'monthly', 'monthly'
  ];

  job_types text[] := ARRAY[
    'full_time', 'full_time', 'full_time', 'full_time', 'full_time',
    'event_based', 'full_time', 'full_time', 'full_time', 'full_time',
    'full_time', 'full_time', 'full_time', 'full_time', 'part_time',
    'contract', 'full_time', 'full_time', 'full_time', 'full_time'
  ];

  exp_reqs integer[] := ARRAY[
    5, 3, 8, 4, 3,
    6, 10, 2, 3, 5,
    2, 7, 4, 3, 3,
    5, 6, 4, 3, 8
  ];

  statuses text[] := ARRAY[
    'open', 'open', 'open', 'open', 'open',
    'open', 'open', 'open', 'open', 'open',
    'matched', 'matched', 'matched', 'filled', 'filled',
    'open', 'open', 'open', 'closed', 'open'
  ];

BEGIN
  -- Get first 20 restaurant profile IDs
  SELECT array_agg(id ORDER BY created_at) INTO rest_ids
  FROM (
    SELECT id, created_at FROM public.restaurant_profiles LIMIT 20
  ) sub;

  FOR i IN 1..20 LOOP
    rid := rest_ids[i];

    INSERT INTO public.jobs (
      restaurant_id, title, cuisine_type, experience_required,
      location, salary_amount, salary_type, job_type,
      working_hours, chefs_needed, start_date, duration,
      kitchen_facilities, benefits, description, status
    ) VALUES (
      rid,
      job_titles[i],
      cuisines[i],
      exp_reqs[i],
      (SELECT city FROM public.restaurant_profiles WHERE id = rid),
      sal_amounts[i],
      sal_types[i],
      job_types[i],
      CASE
        WHEN i % 3 = 0 THEN '9:00 AM - 6:00 PM'
        WHEN i % 3 = 1 THEN '10:00 AM - 10:00 PM (split shift)'
        ELSE '6:00 AM - 2:00 PM'
      END,
      CASE WHEN i % 5 = 0 THEN 2 ELSE 1 END,
      CASE WHEN i <= 15 THEN (now() + (i * interval '7 days'))::date ELSE NULL END,
      CASE
        WHEN job_types[i] = 'full_time' THEN 'Permanent'
        WHEN job_types[i] = 'event_based' THEN '3 days'
        WHEN job_types[i] = 'contract' THEN '6 months'
        ELSE '3 months'
      END,
      CASE
        WHEN i % 4 = 0 THEN 'Fully equipped commercial kitchen with walk-in freezer, tandoor, and modern appliances'
        WHEN i % 4 = 1 THEN 'Modern kitchen with induction cooktops, convection ovens, and prep stations'
        WHEN i % 4 = 2 THEN 'Traditional kitchen with gas stoves, wok stations, and deep fryers'
        ELSE 'State-of-the-art kitchen with imported equipment and cold storage'
      END,
      CASE
        WHEN i % 3 = 0 THEN 'Health insurance, meals provided, accommodation, annual bonus'
        WHEN i % 3 = 1 THEN 'Meals provided, PF, weekly off, festival bonus'
        ELSE 'Meals, accommodation, tips sharing, career growth opportunities'
      END,
      'We are looking for an experienced ' || cuisines[i] || ' chef to join our team. ' ||
      'The ideal candidate should have at least ' || exp_reqs[i] || ' years of experience. ' ||
      'Must be passionate about food and committed to quality.',
      statuses[i]
    );
  END LOOP;

  RAISE NOTICE '✅ Created 20 sample jobs from various restaurants';
END $$;


-- ============================================================
-- VERIFICATION: Show counts
-- ============================================================
SELECT
  (SELECT count(*) FROM public.profiles WHERE role = 'restaurant') as restaurant_users,
  (SELECT count(*) FROM public.restaurant_profiles) as restaurant_profiles,
  (SELECT count(*) FROM public.profiles WHERE role = 'chef') as chef_users,
  (SELECT count(*) FROM public.chef_profiles) as chef_profiles_count,
  (SELECT count(*) FROM public.jobs) as total_jobs;
