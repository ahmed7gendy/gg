import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase';

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const productsRef = ref(database, 'products');

    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const productList = data ? Object.values(data) : [];
      setProducts(productList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{`$${item.price}`}</Text>
    </View>
  );

  const handleSearch = () => {
    // You can implement the search logic based on the searchQuery
    // For now, let's filter products by name containing the search query
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setProducts(filteredProducts);
  };

  const handleNextPage = () => {
    // Implement logic for fetching the next page of products
    // For now, let's assume each page has 20 products
    const itemsPerPage = 20;
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const nextPageProducts = products.slice(startIndex, endIndex);
    setProducts(nextPageProducts);
    setPageNumber(prevPageNumber => prevPageNumber + 1);
  };

  const handlePrevPage = () => {
    // Implement logic for fetching the previous page of products
    // Similar to handleNextPage, but decrement the page number
    // Ensure page number doesn't go below 1
    const itemsPerPage = 20;
    const startIndex = Math.max(0, (pageNumber - 2) * itemsPerPage);
    const endIndex = startIndex + itemsPerPage;
    const prevPageProducts = products.slice(startIndex, endIndex);
    setProducts(prevPageProducts);
    setPageNumber(prevPageNumber => Math.max(1, prevPageNumber - 1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
      />

      <View style={styles.paginationContainer}>
        <TouchableOpacity style={styles.paginationButton} onPress={handlePrevPage} disabled={pageNumber === 1}>
          <Text style={styles.buttonText}>Previous Page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paginationButton} onPress={handleNextPage}>
          <Text style={styles.buttonText}>Next Page</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    width: '70%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
    paddingLeft: 10,
  },
  searchButton: {
    width: '25%',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4285F4',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  productContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
    marginTop: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  paginationButton: {
    width: '48%',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4285F4',
  },
});

export default ProductListScreen;
