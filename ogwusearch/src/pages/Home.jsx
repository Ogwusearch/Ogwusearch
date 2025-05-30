// src/pages/Home.jsx
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 2rem;
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 1rem;
  background: linear-gradient(135deg, #0070f3, #0051a3);
  color: white;
  border-radius: 1rem;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const CTAButton = styled(Link)`
  background: white;
  color: #0070f3;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  text-decoration: none;
  transition: all 0.3s ease;
  &:hover {
    background: #e6e6e6;
  }
`;

const Section = styled.section`
  margin-top: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #222;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const AboutText = styled.p`
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  font-size: 1.1rem;
  text-align: center;
`;

const SkillsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
`;

const Skill = styled.span`
  background: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-weight: 500;
  color: #333;
`;

const ProjectCard = styled.div`
  background: #fafafa;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  max-width: 300px;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProjectsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
`;

const ProjectTitle = styled.h3`
  color: #0070f3;
`;

const ProjectDesc = styled.p`
  font-size: 0.95rem;
  margin: 0.5rem 0;
`;

const Home = () => {
  const skills = [
    "React", "JavaScript", "Node.js", "Supabase", "FastAPI", "HTML", "CSS",
    "Styled-Components", "Git", "REST APIs"
  ];

  const projects = [
    {
      title: "Ogwusearch Engine",
      desc: "A custom-built local search engine with map integration and real-time filtering.",
    },
    {
      title: "Finance Dashboard",
      desc: "Banking app with transaction tracking, loan management, and account control.",
    },
    {
      title: "Portfolio Website",
      desc: "Modern, responsive portfolio with blog, contact, and projects sections.",
    },
  ];

  return (
    <Container>
      <Hero>
        <HeroTitle>Hello, I'm Dee 👋</HeroTitle>
        <HeroSubtitle>
          Full-stack developer building web apps that make an impact.
        </HeroSubtitle>
        <CTAButton to="/projects">View My Work</CTAButton>
      </Hero>

      <Section>
        <SectionTitle>About Me</SectionTitle>
        <AboutText>
          I'm a developer passionate about building clean, user-friendly digital experiences.
          From front-end interfaces to robust backends, I enjoy turning ideas into live products.
          I’m currently working on Ogwusearch, a smart local search app for modern users.
        </AboutText>
      </Section>

      <Section>
        <SectionTitle>Skills</SectionTitle>
        <SkillsGrid>
          {skills.map((skill, i) => (
            <Skill key={i}>{skill}</Skill>
          ))}
        </SkillsGrid>
      </Section>

      <Section>
        <SectionTitle>Featured Projects</SectionTitle>
        <ProjectsGrid>
          {projects.map((p, i) => (
            <ProjectCard key={i}>
              <ProjectTitle>{p.title}</ProjectTitle>
              <ProjectDesc>{p.desc}</ProjectDesc>
              <CTAButton to="/projects">View Project</CTAButton>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </Section>
    </Container>
  );
};

export default Home;
