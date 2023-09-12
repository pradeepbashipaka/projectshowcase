import './index.css'

const ProjectItem = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails

  return (
    <li className="item">
      <img src={imageUrl} alt={name} className="img" />
      <h1 className="name">{name}</h1>
    </li>
  )
}

export default ProjectItem
