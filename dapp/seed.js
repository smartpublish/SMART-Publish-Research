var truffleAssert = require('truffle-assertions');
const sha3 = require('js-sha3').keccak_256
var AssetFactory = artifacts.require("AssetFactory");
var PeerReviewWorkflow = artifacts.require("PeerReviewWorkflow");

module.exports = async function(done) {
    try {
        console.log("Getting deployed version of AssetFactory and PeerReviewWorkflow...")
        let factory = await AssetFactory.deployed();
        let workflow = await PeerReviewWorkflow.deployed();
        
        console.log("Creating some papers...");
        await factory.createPaper(
            'Electromagnetic and gravitational responses of photonic Landau levels',
            'Probing the local response of an integer quantum Hall system enables three different measures of its topology to be explored.',
            'Topology has recently become a focus in condensed matter physics, arising in the context of the quantum Hall effect and topological insulators. In both of these cases, the topology of the system is defined through bulk properties (‘topological invariants’) but detected through surface properties. Here we measure three topological invariants of a quantum Hall material—photonic Landau levels in curved space—through local electromagnetic and gravitational responses of the bulk material. Viewing the material as a many-port circulator, the Chern number (a topological invariant) manifests as spatial winding of the phase of the circulator. The accumulation of particles near points of high spatial curvature and the moment of inertia of the resultant particle density distribution quantify two additional topological invariants—the mean orbital spin and the chiral central charge. We find that these invariants converge to their global values when probed over increasing length scales (several magnetic lengths), consistent with the intuition that the bulk and edges of a system are distinguishable only for sufficiently large samples (larger than roughly one magnetic length). Our experiments are enabled by applying quantum optics tools to synthetic topological matter (here twisted optical resonators). Combined with advances in Rydberg-mediated photon collisions, our work will enable precision characterization of topological matter in photon fluids.',
            'IPFS',
            'https://ipfs.io/ipfs/QmRA3NWM82ZGynMbYzAgYTSXCVM14Wx1RZ8fKP42G6gjgj',
            'blake2b',
            'eb69d309a19d6212c817600130e181fc8870fb7dc73db75ce52eb3c65bd0391795c9a451318f3b6b02e2c32fc91124ab13837d0fcb0c124263ec0d97d7d4204f',
            'Physics',
            ['Quantum Hall','Quantum physics', 'Topological matter'],
            workflow.address,
            '0000-0002-1825-0097',
            { from: '0x6Cc95Ed2F0F4ADDAa0738da9a9C81F9070C28BE4' });
        
        await factory.createPaper(
            'Attention scales according to inferred real-world object size',
            'Natural scenes consist of objects of varying shapes and sizes. The impact of object size on visual perception has been well-demonstrated.',
            'Natural scenes consist of objects of varying shapes and sizes. The impact of object size on visual perception has been well-demonstrated, from classic mental imagery experiments1, to recent studies of object representations reporting topographic organization of object size in the occipito-temporal cortex2. While the role of real-world physical size in perception is clear, the effect of inferred size on attentional selection is ill-defined. Here, we investigate whether inferred real-world object size influences attentional allocation. Across five experiments, attentional allocation was measured in objects of equal retinal size, but varied in inferred real-world size (for example, domino, bulldozer). Following each experiment, participants rated the real-world size of each object. We hypothesized that, if inferred real-world size influences attention, selection in retinal size-matched objects should be less efficient in larger objects. This effect should increase with greater attentional demand. Predictions were supported by faster identified targets in objects inferred to be small than large, with costlier attentional shifting in large than small objects when attentional demand was high. Critically, there was a direct correlation between the rated size of individual objects and response times (and shifting costs). Finally, systematic degradation of size inference proportionally reduced object size effect. It is concluded that, along with retinal size, inferred real-world object size parametrically modulates attention. These findings have important implications for models of attentional control and invite sensitivity to object size for future studies that use real-world images in psychological research.',
            'IPFS',
            'https://ipfs.io/ipfs/QmRA3NWM82ZGynMbYzAgYTSXCVM14Wx1RZ8fKP42G6gjgj',
            'blake2b',
            'eb69d309a19d6212c817600130e181fc8870fb7dc73db75ce52eb3c65bd0391795c9a451318f3b6b02e2c32fc91124ab13837d0fcb0c124263ec0d97d7d4204f',
            'Cognitive Science',
            ['Attention','Human behaviour', 'Object vision'],
            workflow.address,
            '0000-0002-1825-0098',
            { from: '0x3DE95E0653F8c8CF7679a316389B7eA02DC0Dd9C' });

        await factory.createPaper(
            'Structures of an RNA polymerase promoter melting intermediate elucidate DNA unwinding',
            'Cryo-electron microscopy structures of bacterial RNAP–promoter DNA complexes, including structures of partially melted intermediates, suggest a universally conserved common mechanism for promoter DNA opening prior to gene expression.',
            'There are now hundreds of cryptocurrencies in existence and the technological backbone of many of these currencies is blockchain—a digital ledger of transactions. The competitive process of adding blocks to the chain is computation-intensive and requires large energy input. Here we demonstrate a methodology for calculating the minimum power requirements of several cryptocurrency networks and the energy consumed to produce one US dollar’s (US$) worth of digital assets. From 1 January 2016 to 30 June 2018, we estimate that mining Bitcoin, Ethereum, Litecoin and Monero consumed an average of 17, 7, 7 and 14 MJ to generate one US$, respectively. Comparatively, conventional mining of aluminium, copper, gold, platinum and rare earth oxides consumed 122, 4, 5, 7 and 9 MJ to generate one US$, respectively, indicating that (with the exception of aluminium) cryptomining consumed more energy than mineral mining to produce an equivalent market value. While the market prices of the coins are quite volatile, the network hashrates for three of the four cryptocurrencies have trended consistently upward, suggesting that energy requirements will continue to increase. During this period, we estimate mining for all 4 cryptocurrencies was responsible for 3–15 million tonnes of CO2 emissions.',
            'IPFS',
            'https://ipfs.io/ipfs/QmRA3NWM82ZGynMbYzAgYTSXCVM14Wx1RZ8fKP42G6gjgj',
            'blake2b',
            'eb69d309a19d6212c817600130e181fc8870fb7dc73db75ce52eb3c65bd0391795c9a451318f3b6b02e2c32fc91124ab13837d0fcb0c124263ec0d97d7d4204f',
            'Biology',
            ['Cryoelectron microscopy','Enzyme mechanisms', 'Transcription'],
            workflow.address,
            '0000-0002-1825-0099',
            { from: '0x2B63cEEAf7F6139eC617a0663c5F779f1a48bebb' });

        await factory.createPaper(
            'Quantification of energy and carbon costs for mining cryptocurrencies',
            'There are now hundreds of cryptocurrencies in existence and the technological backbone of many of these currencies is blockchain—a digital ledger of transactions.',
            'There are now hundreds of cryptocurrencies in existence and the technological backbone of many of these currencies is blockchain—a digital ledger of transactions. The competitive process of adding blocks to the chain is computation-intensive and requires large energy input. Here we demonstrate a methodology for calculating the minimum power requirements of several cryptocurrency networks and the energy consumed to produce one US dollar’s (US$) worth of digital assets. From 1 January 2016 to 30 June 2018, we estimate that mining Bitcoin, Ethereum, Litecoin and Monero consumed an average of 17, 7, 7 and 14 MJ to generate one US$, respectively. Comparatively, conventional mining of aluminium, copper, gold, platinum and rare earth oxides consumed 122, 4, 5, 7 and 9 MJ to generate one US$, respectively, indicating that (with the exception of aluminium) cryptomining consumed more energy than mineral mining to produce an equivalent market value. While the market prices of the coins are quite volatile, the network hashrates for three of the four cryptocurrencies have trended consistently upward, suggesting that energy requirements will continue to increase. During this period, we estimate mining for all 4 cryptocurrencies was responsible for 3–15 million tonnes of CO2 emissions.',
            'IPFS',
            'https://ipfs.io/ipfs/QmRA3NWM82ZGynMbYzAgYTSXCVM14Wx1RZ8fKP42G6gjgj',
            'blake2b',
            'eb69d309a19d6212c817600130e181fc8870fb7dc73db75ce52eb3c65bd0391795c9a451318f3b6b02e2c32fc91124ab13837d0fcb0c124263ec0d97d7d4204f',
            'Computer Science',
            ['Energy and society','Environmental impact'],
            workflow.address,
            '0000-0002-1825-0097',
            { from: '0x6Cc95Ed2F0F4ADDAa0738da9a9C81F9070C28BE4' });

        await factory.createPaper(
            'Combined economic and technological evaluation of battery energy storage for grid applications',
            'Batteries will play critical roles in modernizing energy grids, as they will allow a greater penetration of renewable energy and perform applications.',
            'Batteries will play critical roles in modernizing energy grids, as they will allow a greater penetration of renewable energy and perform applications that better match supply with demand. Applying storage technology is a business decision that requires potential revenues to be accurately estimated to determine the economic viability, which requires models that consider market rules and prices, along with battery and application-specific constraints. Here we use models of storage connected to the California energy grid and show how the application-governed duty cycles (power profiles) of different applications affect different battery chemistries. We reveal critical trade-offs between battery chemistries and the applicability of energy content in the battery and show that accurate revenue measurement can only be achieved if a realistic battery operation in each application is considered. The findings in this work could call for a paradigm shift in how the true economic values of energy storage devices could be assessed.',
            'IPFS',
            'https://ipfs.io/ipfs/QmRA3NWM82ZGynMbYzAgYTSXCVM14Wx1RZ8fKP42G6gjgj',
            'blake2b',
            'eb69d309a19d6212c817600130e181fc8870fb7dc73db75ce52eb3c65bd0391795c9a451318f3b6b02e2c32fc91124ab13837d0fcb0c124263ec0d97d7d4204f',
            'Chemistry',
            ['Batteries','Energy economics'],
            workflow.address,
            '0000-0002-1825-0098',
            { from: '0x3DE95E0653F8c8CF7679a316389B7eA02DC0Dd9C' });

        await factory.createPaper(
            'A 3D geological model of a structurally complex Alpine region as a basis for interdisciplinary research',
            'Here, we present a dataset corresponding to a renowned tectonic entity in the Swiss Alps.',
            'Certain applications, such as understanding the influence of bedrock geology on hydrology in complex mountainous settings, demand 3D geological models that are detailed, high-resolution, accurate, and spatially-extensive. However, developing models with these characteristics remains challenging. Here, we present a dataset corresponding to a renowned tectonic entity in the Swiss Alps - the Nappe de Morcles - that does achieve these criteria. Locations of lithological interfaces and formation orientations were first extracted from existing sources. Then, using state-of-the-art algorithms, the interfaces were interpolated. Finally, an iterative process of evaluation and re-interpolation was undertaken. The geology was satisfactorily reproduced; modelled interfaces correspond well with the input data, and the estimated volumes seem plausible. Overall, 18 formations, including their associated secondary folds and selected faults, are represented at 10 m resolution. Numerous environmental investigations in the study area could benefit from the dataset; indeed, it is already informing integrated hydrological (snow/surface-water/groundwater) simulations. Our work demonstrates the potential that now exists to develop complex, high-quality geological models in support of contemporary Alpine research, augmenting traditional geological information in the process.',
            'IPFS',
            'https://ipfs.io/ipfs/QmRA3NWM82ZGynMbYzAgYTSXCVM14Wx1RZ8fKP42G6gjgj',
            'blake2b',
            'eb69d309a19d6212c817600130e181fc8870fb7dc73db75ce52eb3c65bd0391795c9a451318f3b6b02e2c32fc91124ab13837d0fcb0c124263ec0d97d7d4204f',
            'Geology',
            ['Hydrogeology','Hydrology'],
            workflow.address,
            '0000-0002-1825-0099',
            { from: '0x2B63cEEAf7F6139eC617a0663c5F779f1a48bebb' });
        
        console.log("Progress some papers to state: Published...");
        let tx = await factory.createPaper(
            'Iberian fish records in the vertebrate collection of the Museum of Zoology of the University of Navarra',
            'The study of freshwater fish species biodiversity and community composition is essential for understanding river systems, the effects of human activities on rivers, and the changes these animals face.',
            'The study of freshwater fish species biodiversity and community composition is essential for understanding river systems, the effects of human activities on rivers, and the changes these animals face. Conducting this type of research requires quantitative information on fish abundance, ideally with long-term series and fish body measurements. This Data Descriptor presents a collection of 12 datasets containing a total of 146,342 occurrence records of 41 freshwater fish species sampled in 233 localities of various Iberian river basins. The datasets also contain 148,749 measurement records (length and weight) for these fish. Data were collected in different sampling campaigns (from 1992 to 2015). Eleven datasets represent large projects conducted over several years, and another combines small sampling campaigns. The Iberian Peninsula contains high fish biodiversity, with numerous endemic species threatened by various menaces, such as water extraction and invasive species. These data may support the development of large biodiversity conservation studies.',
            'IPFS',
            'https://ipfs.io/ipfs/QmRA3NWM82ZGynMbYzAgYTSXCVM14Wx1RZ8fKP42G6gjgj',
            'blake2b',
            'eb69d309a19d6212c817600130e181fc8870fb7dc73db75ce52eb3c65bd0391795c9a451318f3b6b02e2c32fc91124ab13837d0fcb0c124263ec0d97d7d4204f',
            'Zoology',
            ['Biodiversity','Ichthyology'],
            workflow.address,
            '0000-0002-1825-0097',
            { from: '0x6Cc95Ed2F0F4ADDAa0738da9a9C81F9070C28BE4' });
        let asset = tx.logs[0].args.asset;
        await workflow.review(asset, { from: '0xcf73F5E46E282b3461A10c9908D47FE8142C2592' })
        await workflow.accept(asset, 'Good job.', { from: '0xcf73F5E46E282b3461A10c9908D47FE8142C2592' })
        await workflow.review(asset, { from: '0x76D6c04849EF78603eB12C63629b361488ac059B' })
        await workflow.accept(asset, 'I could reproduce your results.', { from: '0x76D6c04849EF78603eB12C63629b361488ac059B' })
        await workflow.review(asset, { from: '0x9e94B41797507584D3388DaFEd10957347C8a81D' })
        await workflow.accept(asset, 'Everything is clearly explained.', { from: '0x9e94B41797507584D3388DaFEd10957347C8a81D' })

        tx = await factory.createPaper(
            'The creative mind: cognition, society and culture',
            'This article provides an overview of the main tendencies and ideas in the embodied mind paradigm in the expanding field of modern cognitive science.',
            'This article provides an overview of the main tendencies and ideas in the embodied mind paradigm in the expanding field of modern cognitive science. The focus is not on the biological and neurological aspects of cognitive science, rather the article demonstrates how basic concepts and theories from cognitive science have influenced linguistics, sociology, the understanding of art and creativity, film and film perception, as well as our understanding of historical film narratives and mediated memories. Although these areas of humanities and social science may seem unrelated, this article demonstrates how the embodied mind paradigm has actually forged links between separate scientific disciplines. Cognitive science and the embodied mind theory have created a stronger interdisciplinary connection between cognitive understanding in social science and humanities. Metaphors and image schema, the way our brain relies on narrative structures, the dynamic ability of the brain to blend old and new schemas, and the unparalleled creativity of the brain are all part of the approaches of the cognitive social science and humanities to social interaction, communication and creativity described here. The article also discusses the relationship between the more universal dimensions of the human mind and the question of cultural and social variations. The argument here is that a cognitive and more universal theory of human beings is not the same as determinism. On the contrary, when we understand our universal commonalities and the basic functions of our embodied mind we will also be better placed to understand cultural and social differences and variations.',
            'IPFS',
            'https://ipfs.io/ipfs/QmRA3NWM82ZGynMbYzAgYTSXCVM14Wx1RZ8fKP42G6gjgj',
            'blake2b',
            'eb69d309a19d6212c817600130e181fc8870fb7dc73db75ce52eb3c65bd0391795c9a451318f3b6b02e2c32fc91124ab13837d0fcb0c124263ec0d97d7d4204f',
            'Psychology',
            ['Psychology','Sociology', 'Cultural and media studies'],
            workflow.address,
            '0000-0002-1825-0098',
            { from: '0x143E32720d06538C4669DEA71Bd01745678b70E7' });
        asset = tx.logs[0].args.asset;
        await workflow.review(asset, { from: '0xcf73F5E46E282b3461A10c9908D47FE8142C2592' })
        await workflow.accept(asset, 'Good job.', { from: '0xcf73F5E46E282b3461A10c9908D47FE8142C2592' })
        await workflow.review(asset, { from: '0x76D6c04849EF78603eB12C63629b361488ac059B' })
        await workflow.accept(asset, 'I could reproduce your results.', { from: '0x76D6c04849EF78603eB12C63629b361488ac059B' })
        await workflow.review(asset, { from: '0x9e94B41797507584D3388DaFEd10957347C8a81D' })
        await workflow.accept(asset, 'Everything is clearly explained.', { from: '0x9e94B41797507584D3388DaFEd10957347C8a81D' })

        tx = await factory.createPaper(
            'A new class of flares from accreting supermassive black holes',
            'Accreting supermassive black holes (SMBHs) can exhibit variable emission across the electromagnetic spectrum and over a broad range of timescales.',
            'Accreting supermassive black holes (SMBHs) can exhibit variable emission across the electromagnetic spectrum and over a broad range of timescales. The variability of active galactic nuclei (AGNs) in the ultraviolet and optical is usually at the few tens of per cent level over timescales of hours to weeks1. Recently, rare, more dramatic changes to the emission from accreting SMBHs have been observed, including tidal disruption events2,3,4,5, ‘changing look’ AGNs6,7,8,9 and other extreme variability objects10,11. The physics behind the ‘re-ignition’, enhancement and ‘shut-down’ of accretion onto SMBHs is not entirely understood. Here we present a rapid increase in ultraviolet–optical emission in the centre of a nearby galaxy, marking the onset of sudden increased accretion onto a SMBH. The optical spectrum of this flare, dubbed AT 2017bgt, exhibits a mix of emission features. Some are typical of luminous, unobscured AGNs, but others are likely driven by Bowen fluorescence—robustly linked here with high-velocity gas in the vicinity of the accreting SMBH. The spectral features and increased ultraviolet flux show little evolution over a period of at least 14 months. This disfavours the tidal disruption of a star as their origin, and instead suggests a longer-term event of intensified accretion. Together with two other recently reported events with similar properties, we define a new class of SMBH-related flares. This has important implications for the classification of different types of enhanced accretion onto SMBHs.',
            'IPFS',
            'https://ipfs.io/ipfs/QmRA3NWM82ZGynMbYzAgYTSXCVM14Wx1RZ8fKP42G6gjgj',
            'blake2b',
            'eb69d309a19d6212c817600130e181fc8870fb7dc73db75ce52eb3c65bd0391795c9a451318f3b6b02e2c32fc91124ab13837d0fcb0c124263ec0d97d7d4204f',
            'Astronomy',
            ['Galaxies and clusters','High-energy astrophysics', 'Time-domain astronomy'],
            workflow.address,
            '0000-0002-1825-0097',
            { from: '0x6Cc95Ed2F0F4ADDAa0738da9a9C81F9070C28BE4' });
        asset = tx.logs[0].args.asset;
        await workflow.review(asset, { from: '0xcf73F5E46E282b3461A10c9908D47FE8142C2592' })
        await workflow.accept(asset, 'Good job.', { from: '0xcf73F5E46E282b3461A10c9908D47FE8142C2592' })
        await workflow.review(asset, { from: '0x76D6c04849EF78603eB12C63629b361488ac059B' })
        await workflow.accept(asset, 'I could reproduce your results.', { from: '0x76D6c04849EF78603eB12C63629b361488ac059B' })
        await workflow.review(asset, { from: '0x9e94B41797507584D3388DaFEd10957347C8a81D' })
        await workflow.accept(asset, 'Everything is clearly explained.', { from: '0x9e94B41797507584D3388DaFEd10957347C8a81D' })

        console.log("Everything done.");
        done();
    } catch (e) {
        console.error(e);
        done();
    }
};