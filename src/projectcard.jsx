import React from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

const fadeIn = (direction, type, delay, duration) => {
  return {
    hidden: {
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type,
        delay,
        duration,
        ease: "easeOut",
      },
    },
  };
};

const ProjectCard = ({ index, name, description, tags, image, sourceCodeLink }) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        glareEnable
        tiltEnable
        tiltMaxAngleX={30}
        tiltMaxAngleY={30}
        glareColor="#aaa6c3"
      >
        <div
          style={{
            backgroundColor: "#2e2e48", // equivalent to bg-tertiary
            width: "100%",
            borderRadius: "16px",
            padding: "20px",
            maxWidth: "300px",
          }}
        >
          <div style={{ position: "relative", height: "230px", width: "100%" }}>
            <img
              src={image}
              alt={name}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "16px",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "0",
                bottom: "0",
                left: "0",
                right: "0",
                margin: "12px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                onClick={() => window.open(sourceCodeLink, "_blank")}
                style={{
                  background: "linear-gradient(135deg, #000, #333)",
                  height: "40px",
                  width: "40px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="https://static-00.iconduck.com/assets.00/github-icon-256x256-k564a04d.png"
                  alt="github"
                  style={{
                    height: "50%",
                    width: "50%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>{name}</h3>
            <p style={{ color: "#aaa6c3", fontSize: "14px", marginTop: "8px" }}>{description}</p>
          </div>
          <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {tags.map((tag) => (
              <p
                key={tag.name}
                style={{
                  fontSize: "14px",
                  color: tag.color || "#ffffff",
                }}
              >
                #{tag.name}
              </p>
            ))}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

export default ProjectCard;