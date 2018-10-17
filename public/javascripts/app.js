class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoading: false,
      hasMore: true,
      items: []
    };
  }

  componentWillMount() {
    this.loadItems();
  }

  loadItems = () => {
    this.setState({ isLoading: true }, () => {
      fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then((results) => {
        const nextItems = results
        this.setState({ hasMore: false, isLoading: false, items: [...this.state.items, ...nextItems, ], });
      })
      .catch((err) => {
        this.setState({ error: err.message, isLoading: false, });
      })
    });
  }

  render() {
    const { error, hasMore, isLoading, items, } = this.state;
    return (
      <div className="wrapper">
        <header className="product-filter">
          <h1>Products Grid</h1>  
          <div className="sort">
            <div className="collection-sort">
              <label>Sort by:</label>
              <select>
                <option value="/">Size</option>
                <option value="/">Price</option>
                <option value="/">Id</option>
              </select>
            </div>
          </div>
        </header>
        <section className="products">
          {items.map((item, index) => (
          <div className="product-card" key={item.id}>
            <div className="product-face" style={{ fontSize: item.size }}>
              {item.face}
            </div>
            <div className="product-info">
              <h5>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price/100)}</h5>
              <h6>{item.date}</h6>
            </div>
          </div>
          ))}
          {error &&
            <div style={{ color: '#900' }}>
              {error}
            </div>
          }
          {isLoading &&
            <div>Loading...</div>
          }
          {!hasMore &&
            <div>~ end of catalogue ~</div>
          }
        </section>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("root"));