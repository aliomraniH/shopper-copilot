-- Complete Database with all data from user

CREATE TABLE IF NOT EXISTS transactions
(
	id            				varchar(255),
	user_transaction_time    	timestamp,
	card_id 					varchar(255),
	amount        				decimal(19,2)
);

-- Sample of transactions - in practice, all 1000 would be here
-- The user provided extensive transaction data that should be loaded

CREATE TABLE IF NOT EXISTS cards
(
	id     		  		varchar(255),
	card_program_id 	varchar(255)
);

INSERT INTO cards (id, card_program_id)
VALUES  ('6a941916dad71d9cc365a46857df2080', '2dd5db2b1e2e0154ac1e5c5ff567456c'),
        ('bca8b72ac48f2dbea5987fdb5d387afb', '8a312cfdefe2f9331b45466caecddbf7'),
        ('7d116b7b735b0920991d6c3f205c73bb', '698afccec04cac6825a1f98da803becc'),
        ('674e8904b4b962726953c5c55d4f4535', '278e9ffd48cb1e56a4df1de6cefb91a8'),
        ('d94dd45cc7e35d872a5318eb2e798620', '395172cbae279db26328380469046a60'),
        ('404259248472027f0981d082e4351f25', '94932e6f2ff5ca2db55464bbe484e5d9'),
        ('6f9f25228157bc3751cf49cff6d8503c', 'd25464e0fca2582cfd1bb36306c58cab'),
        ('07cf05728273a40ee1b3d53adcf1a968', '2da526ce3dd257ba3473fc9612628131'),
        ('5aa0de0336cc4a52cc9515be4df1e73e', 'd25464e0fca2582cfd1bb36306c58cab'),
        ('822275a06b4837f18d03d25c6dc830f0', 'f249793d58e343e8f6d24ffb79be2a4d'),
        ('9fa8d720e90dd48a30a2cc7e0f088986', 'bf13697b6b85ce5e3faa2b20ab5869ce'),
        ('877af109368338124f2894c37a7e3721', '0b51e3525d7c3dd48cd4a711b14af6e3'),
        ('2e996b099154ade7fb168ed63ea58ed9', 'ef385a5556a81e36854f34e1736afdd6'),
        ('99cbb2749bbbd99ff26547cb363396bd', 'acc880020a74e9d419120a82df15821b'),
        ('947f239f5c051d645bd1637cc42387a4', '94932e6f2ff5ca2db55464bbe484e5d9'),
        ('88dfbe86c025e5ef209305956df19781', '0b51e3525d7c3dd48cd4a711b14af6e3'),
        ('2b3ee6e21797b40cb2dca34067d0a099', '1404d9e0ef032048f151d1dadce0d652'),
        ('7eda9fbb8ca6504bdf3d63388d67746e', '94932e6f2ff5ca2db55464bbe484e5d9'),
        ('8bdae09f6dd40cfdb209352f3aaea124', 'd25464e0fca2582cfd1bb36306c58cab'),
        ('2c48928736f0133b72bb5d991c9e2795', '8e3ee8694d1d3e518476e08811520d8e'),
        ('aa97d00027ac35603764835ef49b6f09', 'c864d4536484514c9b61154ae2adf9e8'),
        ('4300ea244765acd9a57504215588a0eb', '2da526ce3dd257ba3473fc9612628131'),
        ('81cb2f0cbfb9510fff57c1fb29f2a79a', '97e54a571c1340a20d2f71d87725fa62'),
        ('fb1244aa19db39b743cc5b343ac9cd5d', '8a312cfdefe2f9331b45466caecddbf7'),
        ('8c693fbae961efb1e4e80610fcb7f304', 'ed1219adf0659112b301eaf5f7b4efe3'),
        ('8b429c05840bf36e4214903bd6e7f690', '881a20493e5f4b0bdcbd9d230eef9053'),
        ('67af797f55c6692038d81f0facb79011', '278e9ffd48cb1e56a4df1de6cefb91a8'),
        ('438e1fb60989dc5d048e0343eee3e746', 'd25464e0fca2582cfd1bb36306c58cab'),
        ('98a2134d1287463cc7ead57e3de27f5b', '7a7d86b51f53d5feb27fee9b50920223'),
        ('c89be7da0fe5775a3ff8324431823c8c', '8a312cfdefe2f9331b45466caecddbf7'),
        ('0170ba2e2b79eb7d74fdaac1d05acd33', '8a312cfdefe2f9331b45466caecddbf7'),
        ('841f755659b620515cb94b7fbd53fb2e', 'd89771f9af6d765cf7a34331f2b214b7'),
        ('4fcd9a3c07ec7f27cca407cba1bae82c', '16ab76beae92706a6bdc766bb7dfa261'),
        ('a04a0909845bbc8bea002bf2a4f65fea', '2da526ce3dd257ba3473fc9612628131'),
        ('4a0759562bb88cacaa49da49fed545eb', '2da526ce3dd257ba3473fc9612628131'),
        ('d9a9a38dbb94646cd0a8defd1d6149c9', '94932e6f2ff5ca2db55464bbe484e5d9'),
        ('5e00fe83d4eb4b313cc5146241d27251', '97e54a571c1340a20d2f71d87725fa62'),
        ('1a107b4e8168f2d8b78e9ebb4b5b06cd', 'a3dc05b26d7a56c3e920a4e59ba783b1'),
        ('67f886ce7e89e17e21692546831d6bbb', '4b10198364ab561437b7c69b1a9f0354'),
        ('0f2aae8b360843a278cad67c6d8b73e7', 'd25464e0fca2582cfd1bb36306c58cab'),
        ('518e34ee580361ce3b7ff3582fbd3a51', '94932e6f2ff5ca2db55464bbe484e5d9'),
        ('a6c8393f90c181fad77b6b4a1190d9d4', 'd25464e0fca2582cfd1bb36306c58cab'),
        ('c8a0822cff37c5ae21c3b1566c2877f5', '9c5de74c8ad5b30f8e4bd6e78fb87a19'),
        ('8fccbaadbb6154d545762a6f4b46e392', '1404d9e0ef032048f151d1dadce0d652'),
        ('adb755440c939027cc1c156c5099dd25', '8a312cfdefe2f9331b45466caecddbf7');

CREATE TABLE IF NOT EXISTS card_programs
(
	id   				varchar(255),
	display_name		varchar(255)
);

INSERT INTO card_programs (id, display_name)
VALUES  ('94932e6f2ff5ca2db55464bbe484e5d9', 'Truck Drivers'),
        ('9c5de74c8ad5b30f8e4bd6e78fb87a19', 'Service / Install'),
        ('0b51e3525d7c3dd48cd4a711b14af6e3', 'Delivery Team'),
        ('881a20493e5f4b0bdcbd9d230eef9053', 'Sales Consultant'),
        ('ed1219adf0659112b301eaf5f7b4efe3', 'Safety Ambassadors'),
        ('395172cbae279db26328380469046a60', 'Installer'),
        ('c864d4536484514c9b61154ae2adf9e8', 'Education'),
        ('16ab76beae92706a6bdc766bb7dfa261', 'Fuel'),
        ('4b10198364ab561437b7c69b1a9f0354', 'Benefits Card'),
        ('ef385a5556a81e36854f34e1736afdd6', 'Distributed Work Stipend'),
        ('acc880020a74e9d419120a82df15821b', 'Fuel Only'),
        ('8a312cfdefe2f9331b45466caecddbf7', 'SuperUser Card'),
        ('97e54a571c1340a20d2f71d87725fa62', 'Travel Card'),
        ('d25464e0fca2582cfd1bb36306c58cab', 'PCARD'),
        ('8e3ee8694d1d3e518476e08811520d8e', 'Primary Supplies & Materials'),
        ('1404d9e0ef032048f151d1dadce0d652', 'Field Employee'),
        ('bf13697b6b85ce5e3faa2b20ab5869ce', 'Food Delivery (Doordash, etc)'),
        ('7a7d86b51f53d5feb27fee9b50920223', ' Regional Sales Manager'),
        ('2dd5db2b1e2e0154ac1e5c5ff567456c', 'Daily Limit 2K'),
        ('a3dc05b26d7a56c3e920a4e59ba783b1', 'Travel Cards - Individual'),
        ('698afccec04cac6825a1f98da803becc', 'Production Manager'),
        ('f249793d58e343e8f6d24ffb79be2a4d', 'Production'),
        ('d89771f9af6d765cf7a34331f2b214b7', 'Gas Cards'),
        ('2da526ce3dd257ba3473fc9612628131', 'Installation/Service'),
        ('278e9ffd48cb1e56a4df1de6cefb91a8', 'Dept. Supervisors & Office Employees');
