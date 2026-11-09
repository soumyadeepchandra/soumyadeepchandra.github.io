---
layout: page
title: 2D-ThermAl
description: Physics-informed generative framework for steady-state and transient thermal analysis of integrated circuits. 0.71 °C RMSE, ~200× faster than COMSOL FEM. (IEEE TCAD)
importance: 2
category: thermal modeling & AI for hardware
github: https://github.com/soumyadeepchandra/2D-ThermAl
related_publications: true
---

**2D-ThermAl** is a physics-informed deep-learning framework for fast **steady-state and transient thermal prediction** of integrated circuits, combining circuit-level power analysis with high-fidelity COMSOL FEM simulations. *(IEEE TCAD, 2025)*

- Built a dataset of **200+ circuit configurations**, from logic gates to complex workloads.
- Developed a **hybrid U-Net** with positional embeddings, feature-level fusion, and physics-informed regularization to preserve thermal-diffusion behavior and spatial consistency.
- Achieved **0.71 °C RMSE** with approximately **200× faster inference than COMSOL FEM**, and generalized across an extended **25–95 °C** operating range with full-scale RMSE below **2.2%**.

[Paper (arXiv)](https://arxiv.org/abs/2512.01163) · [Code & dataset](https://github.com/soumyadeepchandra/2D-ThermAl)

{% bibliography --cited_in_order --query @*[key=chandra2025thermal]* %}
