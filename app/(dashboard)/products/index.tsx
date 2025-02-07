import { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import {StyleSheet, View, ScrollView, Image} from 'react-native';
import { Text, Card } from '@rneui/themed';

interface Product {
  title: string;
  description: string;
  images: string[]
}
export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  const getProducts = useCallback(async () => {
    try {
      const formattedProducts: Product[] = [];
      const products = await axios({
        method: 'GET',
        url: 'https://api.escuelajs.co/api/v1/products',
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

      setProducts(formattedProducts);
    } catch (error) {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);


  return (
    <View style={styles.container}>
      <ScrollView>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8
  },
});
