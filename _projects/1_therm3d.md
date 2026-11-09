---
layout: page
title: Therm3D
description: Physics-aware neural operator for transient thermal modeling of 3D heterogeneous integration (3DHI) systems. 1.09 °C RMSE, ~10,000–20,000× faster than FEM.
importance: 1
category: thermal modeling & AI for hardware
related_publications: true
paper: chandra2026therm3d
venue: Under review · DATE
result: 1.09 °C RMSE, ~10,000–20,000× faster than FEM
tools: [Neural Operators, COMSOL, PyTorch, Physics-Informed ML]
---

**Therm3D** is a physics-informed neural operator framework for near-real-time **steady-state and transient thermal analysis** of 3D heterogeneous integration (3DHI) systems. *(Under review)*

- Built an automated **COMSOL–Python FEM** and synthetic data-generation pipeline covering diverse 3DHI power maps and package configurations.
- Developed a **point-cloud latent neural operator** with coordinate-conditioned decoding and multi-stage autoregressive rollout for long-horizon 3D thermal prediction.
- Incorporated **energy conservation, boundary-condition enforcement, and source/hotspot-aware modeling** for physical consistency.
- Achieved **1.09 °C RMSE** on unseen power maps over transient trajectories while delivering approximately **10,000–20,000× faster** inference than FEM, enabling rapid evaluation of 3DHI power and package configurations.

{% bibliography --query @*[key=chandra2026therm3d] %}
