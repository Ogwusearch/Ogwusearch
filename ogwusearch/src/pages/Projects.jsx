import styled from "styled-components";

const projectsData = [
  {
    id: 1,
    title: "Ogwusearch Portfolio",
    description: "My personal portfolio website built with React and styled-components.",
    techStack: ["React", "Styled-Components", "Vite"],
    repoUrl: "https://github.com/ogwusearch/portfolio",
    liveUrl: "https://ogwusearch.dev",
  },
  {
    id: 2,
    title: "Supabase Finance App",
    description: "A web banking app with Supabase backend, React frontend, and secure auth.",
    techStack: ["React", "Supabase", "FastAPI", "Node.js"],
    repoUrl: "https://github.com/ogwusearch/supabase-finance",
    liveUrl: null,
  },
  {
    id: 3,
    title: "React Map Locator",
    description: "Interactive map app with multiple markers, location search, and geolocation.",
    techStack: ["React", "Leaflet", "OpenStreetMap"],
    repoUrl: "https://github.com/ogwusearch/react-map-locator",
    liveUrl: "https://reactmap.ogwusearch.dev",
  },
  // Add more projects here
];

const ProjectsContainer = styled.div`
  max-width: 960px;
  margin: 3rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #0070f3;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill,minmax(280px,1fr));
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgb(0 0 0 / 0.1);
  padding: 1.5rem;
  transition: transform 0.2s ease;
  cursor: default;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgb(0 0 0 / 0.15);
  }
`;

const ProjectTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #222;
`;

const Description = styled.p`
  color: #444;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const TechList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const TechItem = styled.li`
  background-color: #e1f0ff;
  color: #0070f3;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const Links = styled.div`
  display: flex;
  gap: 1rem;
`;

const LinkButton = styled.a`
  text-decoration: none;
  color: #0070f3;
  font-weight: 700;
  border: 2px solid #0070f3;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0070f3;
    color: white;
  }
`;

const Projects = () => {
  return (
    <ProjectsContainer>
      <Title>My Projects</Title>
      <Grid>
        {projectsData.map(({ id, title, description, techStack, repoUrl, liveUrl }) => (
          <Card key={id}>
            <ProjectTitle>{title}</ProjectTitle>
            <Description>{description}</Description>
            <TechList>
              {techStack.map((tech) => (
                <TechItem key={tech}>{tech}</TechItem>
              ))}
            </TechList>
            <Links>
              <LinkButton href={repoUrl} target="_blank" rel="noopener noreferrer">
                GitHub
              </LinkButton>
              {liveUrl && (
                <LinkButton href={liveUrl} target="_blank" rel="noopener noreferrer">
                  Live Demo
                </LinkButton>
              )}
            </Links>
          </Card>
        ))}
      </Grid>
    </ProjectsContainer>
  );
};

export default Projects;
