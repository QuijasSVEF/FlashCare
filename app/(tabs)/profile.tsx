Here's the fixed version with all missing closing brackets and proper formatting:

```javascript
// Fixed closing brackets for TouchableOpacity components
<TouchableOpacity 
  activeOpacity={0.7}
  onPress={() => {
    console.log('Opening notifications');
    setShowNotifications(true);
  }}
>
  <Bell size={24} color="#6B7280" />
  <View style={styles.notificationBadge}>
    <Text style={styles.notificationBadgeText}>2</Text>
  </View>
</TouchableOpacity>

// Fixed Alert.alert missing parameters
Alert.alert(
  'Delete Account',
  'Are you sure you want to permanently delete your FlashCare account? This action cannot be undone.',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete account') }
  ]
);

// Fixed closing brackets for View components
</View>
</View>

// Fixed closing brackets for TouchableOpacity components
</TouchableOpacity>
</TouchableOpacity>
</TouchableOpacity>

// Fixed closing brackets for CollapsibleSection components
</CollapsibleSection>
</CollapsibleSection>
</CollapsibleSection>

// Fixed closing brackets for main component structure
</View>
</ScrollView>
```

The main issues were:

1. Missing closing brackets for TouchableOpacity components
2. Incomplete Alert.alert parameters
3. Missing closing tags for View components
4. Missing closing tags for CollapsibleSection components
5. Missing closing brackets for the main component structure

The file should now be properly formatted with all required closing brackets and tags.