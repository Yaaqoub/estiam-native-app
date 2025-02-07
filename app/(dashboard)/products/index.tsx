import { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import {StyleSheet, View, ScrollView, Image, Button, RefreshControl} from 'react-native';
import { Text, Card } from '@rneui/themed';

interface Product {
  title: string;
  description: string;
  images: string[]
}
export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const getProducts = useCallback(async (reset = false) => {
    let _offset = offset;
    try {
      if (reset) {
        _offset = 0;
      }
      const formattedProducts: Product[] = [];
      const products = await axios({
        method: 'GET',
        url: 'https://api.escuelajs.co/api/v1/products',
        params: {
          offset: _offset, limit
        }
      });

      for (const product of products.data) {
        let imageUrl: string = '';
        try {
          imageUrl = (new URL(product.images[0])).toString();
        } catch (error) {
          imageUrl = 'https://projetcartylion.fr/wp-content/uploads/2020/08/Placeholder-600x600.png';
        }

        formattedProducts.push({
          ...product,
          images: [imageUrl]
        });
      }

      if (reset) {
        setProducts(formattedProducts);
        setRefreshing(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...formattedProducts]);
      }
    } catch (error) {
      setProducts([]);
    }
  }, [limit, offset]);

  useEffect(() => {
    getProducts();
  }, []);

  const loadProducts = () => {
    setOffset((prevOffset) => prevOffset + limit);
    getProducts();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setOffset(0);
    getProducts(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {
          products.map((product, index) => (
            <Card key={index}>
              <Card.Title>{product.title}</Card.Title>
              <Card.Divider/>
              <View style={{position:"relative",alignItems:"center"}}>
                <Image
                  source={{ uri: product.images[0] }}
                  style={{width:"100%",height:100}}
                  resizeMode="contain"
                />
                <Text >{product.description}</Text>
              </View>
            </Card>
          ))
        }
      </ScrollView>
      <View>
        <Button
          title="Load More"
          onPress={loadProducts}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 40,
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8
  },
});
