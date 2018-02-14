import React, { Component } from 'react';
import logo from './logo-dbc.png';
import './App.css';

class App extends Component {

  

  constructor(props) {
    super(props);

    this.baseUrl = 'https://customerws.herokuapp.com';

    this.state = {
      name: '',
      creditRiskCode : '',
      creditLimit : 0.00,
      risks: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.clearForm = this.clearForm.bind(this);
  }

  handleSubmit(event) {

    fetch(this.baseUrl + '/customer', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
        creditLimit: this.state.creditLimit,
        creditRiskCode : this.state.creditRiskCode
      })
    })

    this.clearForm();

    document.getElementById("customerForm").reset();

    event.preventDefault();
  }

 handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  componentDidMount() {
    this.CreditRiskList();
  }

  clearForm(){
    this.setState({
      name: '',
      creditRiskCode : '',
      creditLimit : 0.00, });

    this.CreditRiskList();
  }

  CreditRiskList() {
    fetch(this.baseUrl + '/credit-risk')
      .then(response => response.json())
      .then(data => { 
        this.setState({ risks: data })
        this.setState({ creditRiskCode : data && data.length > 0 ? data[0].code : ''});
    })
  }


  render() {
     const creditRisks = this.state.risks.map((item, i) => (
        <option key={item.id}>{ item.code }</option>
    ));

    return (
      <div className="App">
        
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        

        <form  id="customerForm"  className="AppForm" onSubmit={this.handleSubmit}>

          <p className="App-intro">
            Utilize este formulário para cadastrar os seus clientes.
          </p>

          <div className="form-group">
            <label htmlFor="name">Nome do Cliente</label>
            <input id="name" name="name" pattern=".*\w+\s+\w.*" required  className="form-control" type="text" defaultValue={this.state.name} onChange={this.handleInputChange}/>
          </div>

         <div className="form-group">
            <label htmlFor="creditRiskCode">Risco</label>
            <select id="creditRiskCode"
              name="creditRiskCode"
              required
              className="form-control"
              defaultValue={this.state.creditRiskCode}
              onChange={this.handleInputChange}>
                { creditRisks }
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="creditLimit">Limite de Crédito</label>
              <div className="input-group"> 
                <div class="input-group-prepend">
                  <span className="input-group-text">R$ </span>
                </div>
                <input id="creditLimit" 
                  name="creditLimit"
                  required
                  type="number"
                  defaultValue={this.state.creditLimit}
                  onChange={this.handleInputChange} 
                  min="0" step="0.01"
                  data-number-to-fixed="2"
                  data-number-stepfactor="100"
                  className="form-control currency"/>
              </div>
          </div> 
        
          <input type="submit" value="Confirmar" className="btn btn-primary float-right"/>
          <input type="reset" value="Limpar" className="btn btn-link float-right" onClick={this.clearForm}/>

        </form>

      </div>

    );
  }
}

export default App;
