class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoading: false,
      hasMore: true,
      curPage: 1,
      curAds: 20,
      numAds: 0,
      sort: false,
      order: 'size',
      items: []
    };

    window.onscroll = () => {
      const {
        loadItems,
        state: {
          error,
          isLoading,
          hasMore,
        },
      } = this;

      if (error || isLoading || !hasMore) return;

      if (
        window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight
      ) {
          loadItems(false, this.state.order);
      }
    };
  }

  componentDidMount() {
    this.loadItems(false, this.state.order);
  }

  loadItems = async (sort, order) => {
    const page = this.state.curPage;
    this.setState({ isLoading: true, sort: sort }, () => {
      fetch(`http://localhost:3000/products?_page=${page}&_limit=15&_sort=${order}`)
      .then(res => res.json())
      .then((results) => {
        const nextItems = results;
        this.setState({ hasMore: (results.length > 0), curPage: (sort) ? 1 : page + 1, isLoading: false, items: [...(sort) ? [] : this.state.items, ...nextItems, ], });
        this.state.items.map((item, index) => {
          if((index + 1) % this.state.curAds === 0 ){
            const num = this.state.numAds + 1;
            const ads = this.state.curAds + 20
            const adsItems = {
              id: Math.floor(Math.random() * (100000 - 0)) + 0 + '-' + (Math.random()).toString(36).substr(2),
              face: '/ads/?r=' + Math.floor(num),
              ads: true
            }
            this.state.items.splice(this.state.curAds, 0, adsItems);
            this.setState({ curAds: this.state.curAds + ads, numAds: num});
          }
        });
      })
      .catch((err) => {
        this.setState({ error: err.message, isLoading: false, });
      })
    });
  }

  formatedDate = (date) => {
    var current = new Date();
    var prev = new Date(date);
    var msMin = 60 * 1000;
    var msHour = msMin * 60;
    var msDay = msHour * 24;
    var msWeek = msDay * 7;
    
    var elapsed = current - prev;
    var relativeTime = "";
    if (elapsed < msMin) {
      relativeTime = Math.round(elapsed/1000) + ' seconds ago';   
    }
    else if (elapsed < msHour) {
      relativeTime = Math.round(elapsed/msMin) + ' minutes ago';   
    }
    else if (elapsed < msDay ) {
      relativeTime = Math.round(elapsed/msHour ) + ' hours ago';   
    }
    else if (elapsed < msWeek) {
      relativeTime = Math.round(elapsed/msDay) + ' days ago';   
    }
    else {
      relativeTime = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: '2-digit' }).format(prev);   
    }
    return ( relativeTime )
  }

  formatedCurrency = (price) => {
    return ( new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price/100) )
  }

  sortProducts = (event) => {
    this.setState({ sort: true, order: event.target.value });
    this.loadItems(true, event.target.value);
  }

  render() {
    const { error, hasMore, isLoading, order, items, sort } = this.state;
    return (
      <div className="wrapper">
        <header className="product-filter">
          <h1>Products Grid</h1>  
          <div className="sort">
            <div className="collection-sort">
              <label>Sort by: </label>
              <select onChange={this.sortProducts} value={order}>
                <option value="size">Size</option>
                <option value="price">Price</option>
                <option value="id">Id</option>
              </select>
            </div>
          </div>
        </header>
        <section className="products">
          {items.map((item, index) => 
            <div className={(!item.ads) ? "product-card" : "product-ads"} key={index} style={{display: (isLoading && sort) ? "none" : ""}}>
              {!item.ads ?
                  <div className="product-wrapper">
                    <div className="product-face">
                      <div className="product-face-child">
                        <p style={{ fontSize: item.size }}>{item.face}</p>
                      </div>
                    </div>
                    <div className="product-info">
                      <div className="product-price">
                        <p>{this.formatedCurrency(item.price)}</p>
                      </div>
                      <div className="product-time">
                        <p>{this.formatedDate(item.date)}</p>
                      </div>
                    </div>
                  </div>
                :
                <div className="product-wrapper">
                  <div className="product-face">
                    <div className="product-face-child">
                      <img className="ad" src={item.face}/>
                    </div>
                  </div>
                  <div className="product-info-ads">
                    <div className="product-title">
                      <p>But first, a word from our sponsors</p>
                    </div>
                  </div>
                </div>
              }
            </div>
          )}
          {error &&
            <div className="loading-container">
              <div style={{ color: '#ff0000' }}>
                {error}
              </div>
            </div>
          }
          {isLoading &&
            <div className="loading-container">
              <div className="loading-text">Loading...</div>
            </div>
          }
          {!hasMore &&
            <div className="loading-container">
              <div className="end-text">~ End of catalogue ~</div>
            </div>
          }
        </section>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("root"));