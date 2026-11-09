// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-research",
          title: "Research",
          description: "Research projects at the Nanoelectronics Research Laboratory, Purdue University.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/research/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Publications in reverse chronological order. * denotes equal contribution.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-repositories",
          title: "Repositories",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Download the PDF version with the icon on the right.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-presented-opel-optimal-transport-guided-procedure-learning-at-neurips-2024-in-vancouver",
          title: 'Presented OPEL: Optimal Transport Guided ProcedurE Learning at NeurIPS 2024 in Vancouver.',
          description: "",
          section: "News",},{id: "news-viper-vision-based-surgical-phase-recognition-published-in-ieee-access",
          title: 'ViPeR: Vision-Based Surgical Phase Recognition published in IEEE Access.',
          description: "",
          section: "News",},{id: "news-preprint-of-remap-regularized-matching-and-partial-alignment-of-video-embeddings-is-now-on-arxiv",
          title: 'Preprint of REMAP: Regularized Matching and Partial Alignment of Video Embeddings is now...',
          description: "",
          section: "News",},{id: "news-2d-thermal-our-physics-informed-generative-framework-for-circuit-thermal-analysis-0-71-c-rmse-200-faster-than-comsol-fem-appears-in-ieee-tcad-arxiv-code",
          title: '2D-ThermAl, our physics-informed generative framework for circuit thermal analysis (0.71 °C RMSE, ~200×...',
          description: "",
          section: "News",},{id: "news-preprint-of-loss-knows-best-detecting-annotation-errors-in-videos-via-loss-trajectories-is-now-on-arxiv",
          title: 'Preprint of Loss Knows Best: Detecting Annotation Errors in Videos via Loss Trajectories...',
          description: "",
          section: "News",},{id: "news-selected-as-a-finalist-for-the-2026-qualcomm-innovation-fellowship-qif",
          title: 'Selected as a Finalist for the 2026 Qualcomm Innovation Fellowship (QIF).',
          description: "",
          section: "News",},{id: "news-recognized-as-a-golden-reviewer-at-icml-2026",
          title: 'Recognized as a Golden Reviewer at ICML 2026.',
          description: "",
          section: "News",},{id: "projects-therm3d",
          title: 'Therm3D',
          description: "Physics-aware neural operator for transient thermal modeling of 3D heterogeneous integration (3DHI) systems. 1.09 °C RMSE, ~10,000–20,000× faster than FEM.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_therm3d/";
            },},{id: "projects-2d-thermal",
          title: '2D-ThermAl',
          description: "Physics-informed generative framework for steady-state and transient thermal analysis of integrated circuits. 0.71 °C RMSE, ~200× faster than COMSOL FEM. (IEEE TCAD)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_thermal/";
            },},{id: "projects-remap",
          title: 'REMAP',
          description: "Regularized partial Gromov–Wasserstein optimal transport for weakly supervised procedure learning across unaligned instructional videos.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_remap/";
            },},{id: "projects-opel",
          title: 'OPEL',
          description: "Optimal-transport-guided procedure learning that aligns temporally unstructured video demonstrations across first- and third-person views. (NeurIPS 2024)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_opel/";
            },},{id: "projects-viper",
          title: 'ViPeR',
          description: "Vision-based surgical phase recognition — temporal structure and action-level representations from surgical video. (IEEE Access 2025)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_viper/";
            },},{id: "projects-image-grammar",
          title: 'Image Grammar',
          description: "Structured visual reasoning over compositional, semantic and syntactic relationships among objects in a scene. (IEEE Access 2024)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_image_grammar/";
            },},{id: "projects-loss-knows-best",
          title: 'Loss Knows Best',
          description: "Detecting mislabeled and noisy video annotations by exploiting model-loss trajectories during training.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_loss_knows_best/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%63%68%61%6E%64%31%33%33@%70%75%72%64%75%65.%65%64%75", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/soumyadeepchandra", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/soumyadeepchandra", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0009-0002-0182-3618", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=xaRULDcAAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
