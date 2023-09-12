import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectItem from './components/ProjectItem'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const viewStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    selectedOption: categoriesList[0].id,
    projectsList: [],
    pageStatus: viewStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  convertCamelCase = eachObj => ({
    id: eachObj.id,
    name: eachObj.name,
    imageUrl: eachObj.image_url,
  })

  onChangeActiveCategory = event => {
    this.setState({selectedOption: event.target.value}, this.getProjects)
  }

  getProjects = async () => {
    const {selectedOption} = this.state
    this.setState({pageStatus: viewStatusConstants.inProgress})
    const url = `https://apis.ccbp.in/ps/projects?category=${selectedOption}`

    const response = await fetch(url)
    console.log(response)

    if (response.ok === true) {
      const data = await response.json()
      const updateData = data.projects.map(each => this.convertCamelCase(each))
      this.setState({
        projectsList: updateData,
        pageStatus: viewStatusConstants.success,
      })
    } else {
      this.setState({pageStatus: viewStatusConstants.failure})
    }
  }

  loadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" width="50" height="50" color="#328af2" />
    </div>
  )

  successView = () => {
    const {projectsList} = this.state

    return (
      <ul className="list-items">
        {projectsList.map(eachProject => (
          <ProjectItem projectDetails={eachProject} key={eachProject.id} />
        ))}
      </ul>
    )
  }

  failureView = () => (
    <div className="notfound-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getProjects()}>
        Retry
      </button>
    </div>
  )

  getStatus = () => {
    const {pageStatus} = this.state
    switch (pageStatus) {
      case viewStatusConstants.success:
        return this.successView()
      case viewStatusConstants.failure:
        return this.failureView()
      case viewStatusConstants.inProgress:
        return this.loadingView()
      default:
        return null
    }
  }

  render() {
    const {selectedOption} = this.state
    return (
      <div className="bg-container">
        <div className="header-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        <div className="bottom-section">
          <select
            value={selectedOption}
            className="input"
            onChange={this.onChangeActiveCategory}
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.getStatus()}
        </div>
      </div>
    )
  }
}

export default App
